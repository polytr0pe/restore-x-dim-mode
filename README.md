# Restore X Dim Mode (Chrome Extension)

This extension restores a softer dark-blue **Dim** theme for X/Twitter.

## Why this version works better

X changes the display modal DOM frequently, so injecting a custom option there can silently break. This extension now gives you a **stable popup toggle** from the extension button, and still attempts to inject a `Dim` option in the display picker when possible.

## What it does

- Adds a toolbar popup with an **Enable Dim** switch.
- Stores your preference in `chrome.storage.local`.
- Applies dark-blue Dim colors on `x.com` and `twitter.com` via a content script.
- Tries to inject a `Dim` radio option into X’s background picker as a convenience (best effort).

## Install locally (Developer Mode)

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this project folder (`restore-x-dim-mode`).
6. Pin the extension and click its icon.
7. Toggle **Enable Dim** on.
8. Open or refresh `https://x.com`.

## Files

- `manifest.json` – MV3 manifest with storage permission, popup, and content script.
- `popup.html`, `popup.css`, `popup.js` – Extension popup UI + toggle logic.
- `content.js` – Applies Dim class from storage and handles best-effort modal option injection.
- `dim.css` – Theme overrides for dark-blue dim styling.

## Notes

- This project intentionally avoids binary assets to stay compatible with Codex WebUI PR creation.
- If X ships major style changes, selectors and CSS overrides may need updates.
