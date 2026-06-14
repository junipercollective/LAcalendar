# Embedding the LA calendar in Showit (mobile scroll fix)

The calendar is an iframe inside a fixed-size Showit **Embed Code** box. The box only
grows tall enough to show all events if Showit's embed listens for the height message
the calendar broadcasts. The calendar (`index.html`) broadcasts:

    { type: "juniper-calendar-height", height: <px> }

If the embed listens for a different type (e.g. the conferences embed's
`juniper-conferences-height`) or points at a different `src`, the iframe never resizes
and stays at its `min-height`. On desktop that's tall enough to look fine; on mobile
(single column) it's only ~2 cards and the rest is clipped with no scroll.

## Paste this into the Showit Embed box

Use the calendar's own published URL for `src` (the GitHub Pages URL for the
`LAcalendar` repo is shown below — update if yours differs):

```html
<iframe id="juniper-calendar" src="https://junipercollective.github.io/LAcalendar/" style="width:100%; border:none; min-height:1200px;" title="LA Social Impact Events" loading="lazy">
</iframe>
<script>
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "juniper-calendar-height") {
      document.getElementById("juniper-calendar").style.height = e.data.height + "px";
    }
  });
</script>
```

## Why the id and type are calendar-specific
The conferences embed uses id `juniper-conferences` and type `juniper-conferences-height`.
Keep the calendar on its own id (`juniper-calendar`) and type (`juniper-calendar-height`)
so that if both embeds ever live on the same page, each listener only resizes its own
iframe. The calendar's `index.html` already sends `juniper-calendar-height`, so the
listener above matches it.

## Showit settings to check
- Set the Embed box to **full width** and make sure it isn't set to hide overflow.
- On the **mobile breakpoint**, don't lock the box to a short height — the script sets
  the iframe height; the box needs to be able to show it.
