"""
Juniper Collective — LA Events Calendar Agent
Nightly agent: pulls events from Eventbrite, Luma, iCal, and scrapeable manual orgs,
enriches each event with Claude (category, area, format), deduplicates, and writes
to the Google Sheet Events tab.
"""

import os
import re
import json
import logging
import requests
from datetime import datetime, timezone, date
from typing import Optional
from bs4 import BeautifulSoup

import gspread
from google.oauth2.service_account import Credentials
from icalendar import Calendar
import anthropic

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SHEET_ID                = os.environ["SHEET_ID"]
EVENTBRITE_API_KEY      = os.environ["EVENTBRITE_API_KEY"]
LUMA_API_KEY            = os.environ.get("LUMA_API_KEY", "")
ANTHROPIC_API_KEY       = os.environ["ANTHROPIC_API_KEY"]
GOOGLE_CREDENTIALS_JSON = os.environ["GOOGLE_CREDENTIALS_JSON"]

EVENTS_TAB   = "Events"
AUTO_TAB     = "Auto Orgs"
MANUAL_TAB   = "Manual Orgs"

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

VALID_CATEGORIES = [
    "Women", "Climate", "Energy & Tech", "Nature", "Ocean",
    "CSR & Business", "Social Impact", "Finance", "Community"
]

# ---------------------------------------------------------------------------
# Org definitions — agent reads these but they also live in Auto Orgs tab
# ---------------------------------------------------------------------------
EVENTBRITE_ORGS = [
    {"name": "We Explore Earth",          "org_id": "39531163583"},
    {"name": "B Local LA",                "org_id": "16865757626"},
    {"name": "WISE LA",                   "org_id": "wise-la"},
    {"name": "YPE LA",                    "org_id": "young-professionals-in-energy-la"},
    {"name": "Climate Designers LA",      "org_id": "climate-designers-la"},
    {"name": "USC Marshall Brittingham",  "org_id": "7595721447"},
]

LUMA_ORGS = [
    {"name": "ClimateTechies SoCal",              "calendar_id": "climatetechiessocal", "kinn_filter": False},
    {"name": "Better Future Club",                "calendar_id": "heyclimate",           "kinn_filter": False},
    {"name": "UCLA Anderson Center for Impact",   "calendar_id": "CenterforImpact",      "kinn_filter": False},
    {"name": "Women in Cleantech & Sustainability","calendar_id": "wcs-la",              "kinn_filter": False},
    {"name": "KINN Venice",                       "calendar_id": "KINNevents",           "kinn_filter": True},
]

ICAL_ORGS = [
    {"name": "SAMO Fund",          "url": "https://www.samofund.org/outdoors-calendar/?ical=1"},
    {"name": "Heal the Bay",       "url": "https://healthebay.org/events/?ical=1"},
    {"name": "Santa Monica Bay",   "url": "https://santamonicabay.org/events/?ical=1"},
    {"name": "Sierra Club Angeles","url": "https://act.sierraclub.org/events/services/apexrest/eventfeed/ent/CLUB?ical=true"},
    {"name": "LARC",               "url": "https://laregionalcollaborative.com/events?format=ical"},
    {"name": "Living Earth",       "url": "https://livingearth.la/gatherings?format=ical"},
    {"name": "LACI",               "url": "https://laincubator.org/events.ics"},
]

# Scrape-able manual orgs only — LinkedIn and Instagram are skipped
MANUAL_ORGS = [
    {"name": "Carbonauts",             "url": "https://www.tickettailor.com/events/thecarbonautssustainabilityfoundation"},
    {"name": "Women's Energy Network", "url": "https://www.womensenergynetwork.org/california"},
    {"name": "CA Climate Action Corps","url": "https://www.caclimateactioncorps.org/"},
    {"name": "Surfrider Foundation LA","url": "https://la.surfrider.org/events"},
    {"name": "Sustainable Works",      "url": "http://www.sustainableworks.org/#Events"},
    {"name": "LA Community Leaders",   "url": "https://lacommunityleaders.com/"},
    # LinkedIn and Instagram skipped — Isabel handles these manually
    # {"name": "Social Impact LA",       "url": "https://www.linkedin.com/groups/13994001/"},
    # {"name": "Side Porch",             "url": "https://www.linkedin.com/company/sideporchllc/"},
    # {"name": "Women in CSR",           "url": "https://www.linkedin.com/company/women-in-corporate-social-responsibility/"},
    # {"name": "Climate Justice Collective", "url": "https://instagram.com/climatejusticeco"},
]

KINN_KEYWORDS = [
    "impact", "sustainability", "climate", "equity", "community",
    "environment", "justice", "restoration", "conservation",
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text

def make_fingerprint(title: str, date_str: str, org_name: str) -> str:
    return f"{slugify(title)}-{date_str}-{slugify(org_name)}"

def is_valid_date(date_str: str) -> bool:
    """Only accept YYYY-MM-DD format — rejects Ongoing, Recurring, Spring 2026, etc."""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except (ValueError, TypeError):
        return False

def is_future(date_str: str) -> bool:
    if not is_valid_date(date_str):
        return False
    event_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    return event_date >= date.today()

# ---------------------------------------------------------------------------
# Google Sheets
# ---------------------------------------------------------------------------
def get_sheet():
    creds_dict = json.loads(GOOGLE_CREDENTIALS_JSON)
    creds = Credentials.from_service_account_info(creds_dict, scopes=SCOPES)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SHEET_ID)
    try:
        ws = sh.worksheet(EVENTS_TAB)
    except gspread.WorksheetNotFound:
        ws = sh.sheet1
    return ws

def load_existing_fingerprints(ws) -> set:
    rows = ws.get_all_records()
    fps = set()
    for row in rows:
        fp = make_fingerprint(
            str(row.get("Title", "")),
            str(row.get("Date", "")),
            str(row.get("Organization", "")),
        )
        fps.add(fp)
    log.info(f"Loaded {len(fps)} existing fingerprints.")
    return fps

def append_events(ws, events: list):
    if not events:
        return
    rows = [[
        e["title"], e["organization"], e["date"], e["time"],
        e["category"], e["area"], e["cost"], e["format"],
        e["description"], e["link"], e["source"], "Yes", e["added_by"],
    ] for e in events]
    ws.append_rows(rows, value_input_option="USER_ENTERED")
    log.info(f"Appended {len(rows)} new events.")

# ---------------------------------------------------------------------------
# Claude — enrich event with category, area, format
# ---------------------------------------------------------------------------
def enrich_event(event: dict, client: anthropic.Anthropic) -> dict:
    """
    Passes raw event data to Claude to assign category, clean up area,
    and infer format. Returns the event with enriched fields.
    """
    prompt = f"""You are categorizing a social impact event in Los Angeles for a curated public calendar.

Event title: {event.get('title', '')}
Organization: {event.get('organization', '')}
Description: {event.get('description', '')}
Raw location from source: {event.get('area', '')}
Cost: {event.get('cost', '')}

Return ONLY a valid JSON object with exactly these three fields:
- "category": one of exactly: Women, Climate, Energy & Tech, Nature, Ocean, CSR & Business, Social Impact, Finance, Community
- "area": use one of these exact values: "Los Angeles", "Westside" (for Santa Monica, Venice, Mar Vista, Culver City, Marina del Rey), "Westwood" (for Westwood, Brentwood, Bel Air, UCLA area), "DTLA" (for Downtown LA, Arts District, Little Tokyo, Financial District), "Silver Lake" (for Silver Lake, Echo Park, Los Feliz, Highland Park, Eagle Rock), "South Bay" (for Manhattan Beach, Redondo Beach, Torrance, El Segundo, Hawthorne), "San Fernando Valley" (for Burbank, Glendale, Pasadena, Studio City, Sherman Oaks), "Online" (for virtual events). Use "Los Angeles" only if no specific area applies.
- "format": one of exactly: In-Person, Virtual, Hybrid

No explanation. No markdown. Just the JSON object."""

    try:
        msg = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=100,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = msg.content[0].text.strip()
        # strip any accidental markdown fences
        raw = re.sub(r"```json|```", "", raw).strip()
        result = json.loads(raw)

        if result.get("category") in VALID_CATEGORIES:
            event["category"] = result["category"]
        if result.get("area"):
            event["area"] = result["area"]
        if result.get("format") in ("In-Person", "Virtual", "Hybrid"):
            event["format"] = result["format"]

    except Exception as e:
        log.warning(f"Enrich failed for '{event.get('title')}': {e}")

    return event

# ---------------------------------------------------------------------------
# Claude — KINN Venice keyword filter
# ---------------------------------------------------------------------------
def passes_kinn_filter(title: str, description: str, client: anthropic.Anthropic) -> bool:
    prompt = (
        f"Does this event belong in a social impact calendar focused on sustainability, "
        f"climate, equity, community, environment, justice, or conservation?\n\n"
        f"Title: {title}\nDescription: {description}\n\nReply YES or NO only."
    )
    try:
        msg = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=10,
            messages=[{"role": "user", "content": prompt}],
        )
        return msg.content[0].text.strip().upper().startswith("YES")
    except Exception as e:
        log.warning(f"KINN filter error: {e}")
        return False

# ---------------------------------------------------------------------------
# Claude — extract events from scraped page text
# ---------------------------------------------------------------------------
def extract_events_from_page(org_name: str, url: str, page_text: str,
                              client: anthropic.Anthropic) -> list:
    prompt = f"""You are scanning a webpage for a social impact organization in Los Angeles.
Organization: {org_name}
Page URL: {url}

Find all specific upcoming events with real dates. Skip anything described as "ongoing," "recurring," or without a concrete date.

Page content (truncated):
{page_text[:6000]}

Return ONLY a valid JSON array. Each object must have:
- "title": event name (string)
- "date": in YYYY-MM-DD format — skip events without a real date
- "time": "HH:MM" 24hr format, or empty string
- "description": brief summary under 200 characters
- "link": direct event URL or {url} if no specific link
- "cost": "Free" or "Ticketed"

If no specific upcoming events are found, return [].
No explanation. No markdown. Just the JSON array."""

    try:
        msg = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = msg.content[0].text.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        events = json.loads(raw)
        if not isinstance(events, list):
            return []
        return events
    except Exception as e:
        log.warning(f"Event extraction failed for {org_name}: {e}")
        return []

# ---------------------------------------------------------------------------
# Eventbrite puller
# ---------------------------------------------------------------------------
def fetch_eventbrite_org_events(org: dict) -> list:
    org_id = org["org_id"]
    url = f"https://www.eventbriteapi.com/v3/organizers/{org_id}/events/"
    headers = {"Authorization": f"Bearer {EVENTBRITE_API_KEY}"}
    params = {"status": "live", "time_filter": "current_future", "expand": "venue"}
    events = []
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=15)
        resp.raise_for_status()
        for ev in resp.json().get("events", []):
            start = ev.get("start", {})
            date_local = start.get("local", "")
            date_part = date_local[:10] if date_local else ""
            if not is_valid_date(date_part):
                continue
            time_part = date_local[11:16] if len(date_local) > 10 else ""
            venue = ev.get("venue") or {}
            events.append({
                "title":        ev.get("name", {}).get("text", ""),
                "organization": org["name"],
                "date":         date_part,
                "time":         time_part,
                "category":     "",   # Claude will fill
                "area":         venue.get("city") or "",
                "cost":         "Free" if ev.get("is_free") else "Ticketed",
                "format":       "In-Person",  # Claude may override
                "description":  (ev.get("description", {}).get("text") or "")[:200],
                "link":         ev.get("url", ""),
                "source":       "Eventbrite",
                "added_by":     "Agent",
            })
        log.info(f"Eventbrite — {org['name']}: {len(events)} events")
    except Exception as e:
        log.warning(f"Eventbrite error for {org['name']}: {e}")
    return events

# ---------------------------------------------------------------------------
# Luma puller
# ---------------------------------------------------------------------------
def fetch_luma_org_events(org: dict, client: anthropic.Anthropic) -> list:
    url = "https://api.lu.ma/public/v1/calendar/list-events"
    headers = {"x-luma-api-key": LUMA_API_KEY}
    params = {"calendar_api_id": org["calendar_id"], "pagination_limit": 50}
    events = []
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=15)
        resp.raise_for_status()
        for entry in resp.json().get("entries", []):
            ev = entry.get("event", {})
            start_at = ev.get("start_at", "")
            date_part = start_at[:10] if start_at else ""
            if not is_valid_date(date_part):
                continue
            title = ev.get("name", "")
            description = ev.get("description_short") or ev.get("description") or ""
            if org.get("kinn_filter") and not passes_kinn_filter(title, str(description), client):
                log.info(f"KINN filter excluded: {title}")
                continue
            ticket_type = ev.get("ticket_type", "")
            events.append({
                "title":        title,
                "organization": org["name"],
                "date":         date_part,
                "time":         start_at[11:16] if len(start_at) > 10 else "",
                "category":     "",
                "area":         "",
                "cost":         "Free" if ticket_type in ("free", "donation") else "Ticketed",
                "format":       "In-Person",
                "description":  str(description)[:200],
                "link":         f"https://lu.ma/{ev.get('url', '')}",
                "source":       "Luma",
                "added_by":     "Agent",
            })
        log.info(f"Luma — {org['name']}: {len(events)} events")
    except Exception as e:
        log.warning(f"Luma error for {org['name']}: {e}")
    return events

# ---------------------------------------------------------------------------
# iCal puller
# ---------------------------------------------------------------------------
def fetch_ical_events(org: dict) -> list:
    url = org["url"].replace("webcal://", "https://")
    events = []
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        cal = Calendar.from_ical(resp.content)
        now = datetime.now(timezone.utc)
        for component in cal.walk():
            if component.name != "VEVENT":
                continue
            dtstart = component.get("DTSTART")
            if not dtstart:
                continue
            dt = dtstart.dt
            if hasattr(dt, "date"):
                dt_aware = dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
            else:
                dt_aware = datetime(dt.year, dt.month, dt.day, tzinfo=timezone.utc)
            if dt_aware < now:
                continue
            date_part = dt_aware.strftime("%Y-%m-%d")
            time_part = dt_aware.strftime("%H:%M") if hasattr(dtstart.dt, "hour") else ""
            location  = str(component.get("LOCATION", "")).strip()
            events.append({
                "title":        str(component.get("SUMMARY", "")),
                "organization": org["name"],
                "date":         date_part,
                "time":         time_part,
                "category":     "",
                "area":         location or "",
                "cost":         "Free",
                "format":       "In-Person",
                "description":  str(component.get("DESCRIPTION", ""))[:200],
                "link":         str(component.get("URL", "")),
                "source":       "iCal",
                "added_by":     "Agent",
            })
        log.info(f"iCal — {org['name']}: {len(events)} events")
    except Exception as e:
        log.warning(f"iCal error for {org['name']}: {e}")
    return events

# ---------------------------------------------------------------------------
# Manual org scraper
# ---------------------------------------------------------------------------
def scrape_manual_org(org: dict, client: anthropic.Anthropic) -> list:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; JuniperBot/1.0)"}
        resp = requests.get(org["url"], headers=headers, timeout=20)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        # Remove nav, footer, scripts, styles to reduce noise
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        page_text = soup.get_text(separator=" ", strip=True)
        raw_events = extract_events_from_page(org["name"], org["url"], page_text, client)

        events = []
        for ev in raw_events:
            date_str = str(ev.get("date", "")).strip()
            if not is_valid_date(date_str) or not is_future(date_str):
                continue
            events.append({
                "title":        str(ev.get("title", "")),
                "organization": org["name"],
                "date":         date_str,
                "time":         str(ev.get("time", "")),
                "category":     "",
                "area":         "",
                "cost":         ev.get("cost", "Free"),
                "format":       "In-Person",
                "description":  str(ev.get("description", ""))[:200],
                "link":         str(ev.get("link", org["url"])),
                "source":       f"Manual – {org['name']}",
                "added_by":     "Agent",
            })
        log.info(f"Manual scrape — {org['name']}: {len(events)} events")
        return events
    except Exception as e:
        log.warning(f"Scrape error for {org['name']}: {e}")
        return []

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    log.info("=== Juniper Calendar Agent starting ===")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    ws = get_sheet()
    existing = load_existing_fingerprints(ws)
    all_raw = []

    # Eventbrite
    for org in EVENTBRITE_ORGS:
        all_raw.extend(fetch_eventbrite_org_events(org))

    # Luma
    if LUMA_API_KEY:
        for org in LUMA_ORGS:
            all_raw.extend(fetch_luma_org_events(org, client))
    else:
        log.warning("LUMA_API_KEY not set — skipping Luma.")

    # iCal
    for org in ICAL_ORGS:
        all_raw.extend(fetch_ical_events(org))

    # Manual scrape
    for org in MANUAL_ORGS:
        all_raw.extend(scrape_manual_org(org, client))

    # Deduplicate
    new_events = []
    for ev in all_raw:
        fp = make_fingerprint(ev["title"], ev["date"], ev["organization"])
        if fp not in existing:
            existing.add(fp)
            new_events.append(ev)

    log.info(f"New events before enrichment: {len(new_events)}")

    # Enrich with Claude (category, area, format)
    enriched = []
    for ev in new_events:
        enriched.append(enrich_event(ev, client))

    append_events(ws, enriched)
    log.info(f"=== Done. {len(enriched)} events added. ===")


if __name__ == "__main__":
    main()
