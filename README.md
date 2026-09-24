# adamasis.com

A personal site built as a working notebook: lectures, lab journal entries, labs, research and a library.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321, drafts visible
npm run build     # production site in dist/, drafts hidden
npm run preview   # serve the production build locally
```

## Fill in the placeholders

Every piece of personal content starts as a placeholder in `[square brackets]`, often followed by a `Tip:` on what to write. To list everything still left to fill in:

```sh
npm run placeholders
```

Start with `src/site.config.ts` (name, contact details, headline and thesis), then `src/data/` (profile, experience, education, library), then the example pages in `src/content/`. Rename or delete the example files as you replace them. If you rename a research file, update the `research:` lists that point to it.

## Write something

```sh
npm run new journal "Title of the entry"
npm run new lecture "Title of the lecture"
npm run new lab "Project name"
npm run new research "Research topic"
npm run new paper "Paper title"
```

Each command creates a Markdown file in `src/content/` with the fields filled in and `draft: true`. Set `draft: false` to publish.

`src/content/` also works as an Obsidian vault.

## Where things live

| What | Where |
| --- | --- |
| Name, email, links, thesis, "currently" and upcoming events | `src/site.config.ts` |
| The seven topics | `src/site.config.ts` |
| Field rules for every content type | `src/content.config.ts` |
| Lectures, journal, labs, research, papers | `src/content/<section>/` |
| Library, experience, education | `src/data/*.yaml` |
| Profile story | `src/data/profile.md` |
| Profile details: principles, skills, recognition, community, next steps | `src/data/profile.ts` |
| Portrait (optional, shown on the Profile if present) | `public/images/portrait.jpg` |
| Colophon | `src/pages/reference/colophon.md` |
| Styles | `src/styles/global.css` |
| Images | `public/images/` |
| CV (optional, linked automatically if present) | `public/cv.pdf` |

## Fields

Every lecture, entry, lab and paper takes:

- `title`, `summary` (one sentence, shown in search results and link previews)
- `topics`: any of `ai`, `edge`, `robotics`, `data`, `networking`, `access`, `leadership`
- `tags`: up to five freeform tags
- `research`: ids of the research topics it supports, which builds each topic's evidence log
- `draft`

Journal entries add `date`, `status` (`hypothesis`, `testing`, `confirmed`) and an optional `setup`. Entry numbers are assigned by date.

Lectures add `format` (`for-the-room` or `teardown`), `forTheRoom` (the short summary for decision-makers), `published`, and an optional `revised`, `series` and `changelog`. Each changelog item raises the revision number.

Research topics add `status` (`active`, `exploratory`, `concluded`), `pinned`, `version`, `started`, `questions` and `changelog`. The pinned topic is the primary research shown on the home page.

## Writing features

- Footnotes (`text[^1]` and `[^1]: note`) become margin notes on wide screens.
- An image on its own line becomes a numbered figure. Its title becomes the caption: `![alt text](/images/file.svg "Caption")`.
- Links to other pages on the site show up in that page's "Referenced by" list.

## Deploy

Push the repository to GitHub, import it into a static host such as Vercel, Netlify or Cloudflare Pages (build command `npm run build`, output `dist`), then point adamasis.com at the host from Namecheap's DNS settings.
