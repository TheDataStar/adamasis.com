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

Start with **Site settings** in the admin dashboard (name, contact details, headline and thesis), then Profile, Experience and Education, then add Lectures, Journal entries, Labs and Library items. Rename or delete the example files as you replace them. If you rename a research file, update the `research:` lists that point to it.

## Admin dashboard

Run `npm run dev` and open http://localhost:4321/keystatic (or use https://adamasis.com/keystatic, below). Everything the site shows can be edited there with forms:

| Dashboard group | What you manage |
| --- | --- |
| **Site** | **Site settings**: name, home headline and tagline, thesis, site description, email, phone, booking link, social links, CV upload, the "Right now" strip, upcoming talks, each section's intro and home-card text, and topic names. **Contact page**: intro, reasons to write, closing line and card text. **Colophon**. |
| **About** | Profile (headshot, photos, principles, skills, recognition, community, what's next, Experience page intro), Experience roles, Education & credentials (with optional verification links). |
| **Writing** | Lectures and Journal entries. |
| **Work** | Labs (with uploadable artifacts: diagrams, configs, slides, datasets), Research topics, Papers (with PDF upload). |
| **Resources** | Library items (with cover images). |

- **Create** with the + on any dashboard card. New Lectures, Journal entries, Labs and Papers start as drafts; uncheck **Draft** to publish.
- **Edit** by opening an entry and pressing **Save**. The arrow icon in the top bar opens the page on the site (drafts show only in local dev).
- **Duplicate** an entry with the copy icon to reuse its structure for a new one.
- **Delete** with the bin icon. Deleting an entry also deletes the files uploaded to it.
- **Uploads:** images in the editor go to `public/images/<section>/<entry>/`; lab artifacts to `public/files/labs/`; paper PDFs to `public/papers/`; the CV to `public/cv.pdf`. Remove an upload in its field and save to delete the file.
- **Margin notes:** select text in the editor and click the superscript button. The text moves into the margin on the live site.
- **Figures:** use the image button. The image's alt text becomes the numbered caption.
- A new entry created in local dev may need a dev-server restart before its page appears on the site.

### Online

With the four variables below set in Vercel, the dashboard also runs at https://adamasis.com/keystatic. You sign in with GitHub and each save is committed to the repository, which triggers a deploy. Only the GitHub account listed in `src/middleware.ts` is let in, and saving also requires write access to the repository.

| Variable | Value |
| --- | --- |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The GitHub App's name as it appears in its URL |
| `KEYSTATIC_GITHUB_CLIENT_ID` | The app's Client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | A client secret generated on the app's page |
| `KEYSTATIC_SECRET` | Any long random string |

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
| Name, email, links, thesis, "currently", upcoming events, section intros, topic names | `src/data/site.json` (Site settings) |
| Contact page copy | `src/data/contact.json` (Contact page) |
| Nav order, topic ids and fallbacks | `src/site.config.ts` |
| Field rules for every content type | `src/content.config.ts` |
| Lectures, journal, labs, research, papers | `src/content/<section>/` |
| Library items | `src/content/library/*.yaml` |
| Experience | `src/content/experience/*.yaml` |
| Education and credentials | `src/content/education/*.yaml` |
| Profile: subtitle, expertise, photos, principles, skills, recognition, community, next steps | `src/data/profile.yaml` |
| Portrait and profile photos | `public/images/profile/` |
| Colophon | `src/pages/reference/colophon.md` |
| Styles | `src/styles/global.css` |
| Images | `public/images/` |
| CV (optional, uploaded in Site settings) | `public/cv.pdf` |

## Fields

Every lecture, entry, lab and paper takes:

- `title`, `summary` (one sentence, shown in search results and link previews)
- `topics`: any of `security`, `ai`, `edge`, `robotics`, `data`, `networking`, `access`, `leadership`
- `tags`: up to five freeform tags
- `research`: ids of the research topics it supports, which builds each topic's evidence log
- `draft`

Journal entries add `date`, `status` (`hypothesis`, `testing`, `confirmed`) and an optional `setup`. Entry numbers are assigned by date.

Lectures add `format` (`for-the-room`, `classroom`, `teardown` or `case-study`), `forTheRoom` (the summary box at the top), optional `role` and `period` for case studies, `published`, and an optional `revised`, `series` and `changelog`. Each changelog item raises the revision number.

Research topics add `status` (`active`, `exploratory`, `concluded`), `pinned`, `version`, `started`, `questions` and `changelog`. The pinned topic is the primary research shown on the home page.

## Writing features

- Footnotes (`text[^1]` and `[^1]: note`) become margin notes on wide screens.
- An image on its own line becomes a numbered figure. Its title becomes the caption: `![alt text](/images/file.svg "Caption")`.
- Links to other pages on the site show up in that page's "Referenced by" list.

## Deploy

Push the repository to GitHub, import it into a static host such as Vercel, Netlify or Cloudflare Pages (build command `npm run build`, output `dist`), then point adamasis.com at the host from Namecheap's DNS settings.
