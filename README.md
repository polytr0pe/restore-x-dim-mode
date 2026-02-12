# Restore X Dim Mode (Chrome Extension)

This extension adds back a **Dim** option in X/Twitter display settings and applies a dark-blue theme that is closer to the old legacy dim mode.

## What it does

- Injects a third background option called **Dim** into the display background picker.
- Persists your choice in local storage.
- Applies a dark-blue color palette when Dim is selected.
- Automatically disables Dim if you switch to native theme options.

## Install locally (Developer Mode)

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this project folder (`restore-x-dim-mode`).
6. Open `https://x.com` and open **Display** settings.

## Files

- `manifest.json` – Chrome extension manifest (MV3).
- `content.js` – Injects the Dim option and handles selection state.
- `dim.css` – Theme overrides for dark-blue dim styling.

## Notes

- This project intentionally avoids binary assets to stay compatible with Codex WebUI PR creation.
- X/Twitter’s DOM changes frequently. If the display modal structure changes, the selector logic in `content.js` may need small updates.
