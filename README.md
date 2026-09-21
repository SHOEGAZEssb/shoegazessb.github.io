# Code & Sound portfolio

A static portfolio for GitHub Pages. No build step, packages, or API tokens required.

## Personalize

Edit `portfolio.js` to update your name, introduction, bio, and GitHub profile. Its `projects` array is the curated selection: the site never imports other repositories automatically.

The selection includes three coding projects and two musical projects. Music descriptions and listening links are pending. Add or edit entries as needed. Each project has:

- `id`: a unique identifier.
- `title`, `description`, `label`: your public project text.
- `kind`: `code` or `music`, for filtering.
- `tags`: a list of short labels (languages, tools, genre, etc.).
- `url`: the full HTTPS URL to a repository, live site, Bandcamp, SoundCloud, or another project page.
- `sample`: set to `false` when the entry represents your real work.

Remove any unused entries. The `links` array controls the dedicated links section: add a title, description, and HTTPS URL. Entries with an empty URL appear as non-clickable "Coming soon" placeholders. Change the introduction heading and other editorial text directly in `index.html`; colors and layout are in `styles.css`.

## Preview and publish

Open `index.html` in a modern browser to preview; it also works through any static web server. Commit and push the files when ready, and serve the repository root through GitHub Pages. No deployment has been performed as part of creating these files.

The minimal typographic layout uses sliced text, red/cyan channel offsets, and brief glitch animations. Project descriptions and tags are shown in the detail dialogs. The site includes responsive layouts, keyboard navigation, accessible native project dialogs, project filters, and reduced-motion support. Fonts and artwork are local/system-based, with no third-party requests needed to render the page.
