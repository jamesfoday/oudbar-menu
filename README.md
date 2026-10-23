# OU D’BAR digital menu prototype

Static HTML, CSS and JavaScript. No build step or npm installation required.

## Open in VS Code

Extract this archive, then open the `oudbar-menu` folder in VS Code.
Use the Live Server extension and select **Open with Live Server** on `index.html`.
Alternatively, if Python 3 is installed:

```sh
cd /path/to/oudbar-menu
python3 -m http.server 5500
```

Open http://localhost:5500 . Stop the server with Ctrl+C.

## Files

- `index.html`: page and dialog structure.
- `style.css`: visual styling and responsive layouts.
- `app.js`: menu examples, search, favorites, and simulated Wi-Fi journey.
- `assets/`: original OU D’BAR logo and site photographs used in this prototype.

## GitHub

Create an empty repository named `oudbar-menu` under your account (do not initialize it with a README).
Then, from this extracted folder:

```sh
git init
git add .
git commit -m "Add OU D’BAR menu prototype"
git branch -M main
git remote add origin https://github.com/jamesfoday/oudbar-menu.git
git push -u origin main
```

The remote above assumes that exact repository and account. Change it to your created repository's URL if different. Authenticate through GitHub's normal browser or credential-manager flow; do not use your account password as a Git password.

## Hosting

Upload this folder to a static hosting provider, with `index.html` at the web root.
For a Git-connected static host, there is no build command and the publish directory is the repository root.
Use the DNS targets provided by the chosen host for `oudbar.jamesfoday.com`; do not point the same hostname to two different hosting services.

## Prototype limits

Menu items and imagery are illustrative; prices and confirmed item-level photographs are not supplied.
Instagram follows, notifications, DMs, access links and Wi-Fi connection are simulated locally.
The live system requires account eligibility checks, Meta/Instagram integration, device/session association and supported guest-router authorization. Existing followers and unavailable notifications need fallback access.
Favorites are saved only in this browser's local storage. No backend or credentials are included.
Google Fonts are loaded from Google's servers when network access allows, with local font fallbacks.
