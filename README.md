# Pleiadian New Age Movement site

## What ships

`index.html` is the live page (Movement site, with the Field Guide as one section). It is the video-portal design: fully
self-contained, no local assets. Fonts come from Google Fonts, the hero
poster and mp4 come from CloudFront.

```bash
npm run build     # -> dist/
npm run dev       # local preview
```

The build just copies `index.html` and `public/` into `dist/`. No JS
bundle is produced, because the page needs none.

## The unused React version

`src/App.tsx` is a second, alternate design of the same page — React +
Tailwind + framer-motion, with an animated starfield hero instead of the
video portal. It type-checks clean but **never runs**: `index.html` has no
`<div id="root">` and no `<script type="module" src="/src/main.tsx">`, so
React is never mounted.

It is kept on purpose, not abandoned. To switch to it, strip the page body
out of `index.html` and put those two tags back.
