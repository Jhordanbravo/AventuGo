# AventuGo — Figma to HTML

A three-page travel website implemented from a supplied Figma design using HTML, CSS and vanilla JavaScript. The mobile design is adapted into desktop layouts while preserving its palette, typography and visual identity.

[Original Figma design](https://www.figma.com/design/cm6hxwhY5W2wBPuk2MufJg/AventuGo?node-id=15-2)

## Pages
| File | Purpose |
| --- | --- |
| `dist/index.html` | Search, filter, sort and save destinations and restaurants. |
| `dist/destino.html` | Explore Cancún flights, hotels and activities. |
| `dist/hotel.html` | Explore Garza Blanca Resort and simulate a stay. |

## Features
- Case- and accent-insensitive search, country filters and A–Z/Z–A sorting.
- Local favorites and airline preferences.
- Hotel photo gallery with arrow-key navigation and Escape to close.
- Date validation and simulated stay totals, limited to 30 nights.
- Local stay confirmation and editing.
- Responsive layouts, visible focus, labeled forms and reduced-motion styles.
- Bundled images, icons and Josefin Sans / Istok Web fonts.

## Run locally
```bash
python3 -m http.server 8000 --directory dist
```
Open http://localhost:8000. No packages, framework or build step are required. Serve `dist/` as the site root when deploying.

## Project structure
- `dist/css/`: shared styles and local font definitions.
- `dist/js/data.js`: sample destinations, restaurants and hotel data.
- `dist/js/common.js`: shared dialogs, favorites and preferences.
- `dist/js/home.js`: search, filters and sorting.
- `dist/js/destination.js`: airline preference.
- `dist/js/hotel.js`: gallery and simulated stay.
- `dist/assets/`: bundled visual resources.
- `ESTADO_ENTREGA.md`: original delivery notes in Spanish.
- `mapa-recursos-figma.json`: original Figma resource mapping.

## Scope
The detailed journey is Home → Cancún → Garza Blanca Resort. Other destination and restaurant cards are inspiration content and do not all have detail pages. The fictional rate is MXN 3,200 per night. There are no real bookings, payments, accounts, live availability or backend services.

Original interface content remains in Spanish. Images and icons come from the supplied design; their ownership is not transferred by this repository. Fonts are Josefin Sans and Istok Web from Google Fonts.
