# Embedding the calendar in Showit (mobile scroll fix)

The calendar is an iframe. Showit places it inside a fixed-size **Embed Code** box.
On mobile that box is short, so it clips after ~2 events and won't scroll (iOS Safari
forces an iframe to its full content height and ignores CSS height, so a fixed box
with no scrolling just hides everything below the fold).

The fix: the calendar already reports its real height to the page via `postMessage`.
Paste the snippet below into your Showit Embed box so the iframe **grows to fit all
events** — then the whole page scrolls normally on mobile, no inner scrollbar needed.

## Paste this into the Showit Embed box

Keep whatever `src` URL you are already using (shown here is the GitHub Pages URL —
update it if yours differs):

```html
<iframe id="juniper-cal"
  src="https://junipercollective.github.io/LAcalendar/"
  style="width:100%;border:0;display:block;"
  scrolling="no"
  title="LA Social Impact Events"></iframe>
<script>
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "juniper-calendar-height" && e.data.height) {
      var f = document.getElementById("juniper-cal");
      if (f) f.style.height = e.data.height + "px";
    }
  });
</script>
```

## Showit settings to check
- Set the Embed box to **full width**, and make sure it is allowed to grow (not set to
  hide overflow). The script sets the iframe height; the box needs to reveal it.
- On the **mobile breakpoint**, give the Embed box a generous height so it doesn't
  constrain the iframe before the resize kicks in.

## Fallback (only if the box truly cannot grow)
Wrap the iframe in a fixed-height scroll window instead. This gives an internal scroll
within a fixed area (slightly worse UX, but works with no resize handshake):

```html
<div style="height:80vh;overflow:auto;-webkit-overflow-scrolling:touch;">
  <iframe
    src="https://junipercollective.github.io/LAcalendar/"
    style="width:100%;border:0;display:block;"
    scrolling="yes"
    title="LA Social Impact Events"></iframe>
</div>
```
