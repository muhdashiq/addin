# Addin.in: The Story

A legacy landing page for Addin.in, the company I started during college in Kerala (April 2010 to
December 2013) to bring small-scale industries online. It's a fully static site built with Vite,
React 18 and TypeScript, and it deploys to GitHub Pages.

The page changes as you scroll, from paper and ink to a glowing network. The interface ages with it:
the nav starts as a 2010 Android status bar and ends as a modern floating pill. Try typing `2010`
for the retro skin.

## Local setup

You need Node 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

| Command             | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Starts the dev server                        |
| `npm run build`     | Builds the static site into `dist/`          |
| `npm run preview`   | Serves `dist/` under the real base path      |
| `npm run typecheck` | Runs the TypeScript compiler in strict mode  |
| `npm run lint`      | Runs ESLint (typescript-eslint, hooks, a11y) |
| `npm run test`      | Runs Vitest and React Testing Library        |
| `npm run format`    | Formats everything with Prettier             |

## Editing the content

All the copy lives in [`src/content/content.ts`](src/content/content.ts), typed by
[`src/content/types.ts`](src/content/types.ts). You shouldn't need to touch a component to change
the words.

- **Tagline:** three alternatives are in the comment at the top of `content.ts`. To swap, change
  `hero.headline` and `motto.text`.
- **Impact numbers:** set them under `work.stats`. A number left `undefined` stays hidden, so there's
  never a blank or a placeholder on the page.
- **Timeline:** each milestone has an optional `date` and a `verified` flag. A milestone with no date
  simply doesn't show one.
- **Lessons:** all six are drafts with `draft: true`. Rewrite them in your own words, then set it to
  `false`.

The tests check the content too. If you fill in a stat or a milestone date, update the matching
assertion in [`src/content/content.test.ts`](src/content/content.test.ts). Those assertions exist so
a number can't appear by accident.

## Setting the repo name

`base` in [`vite.config.ts`](vite.config.ts) has to match where the site is served from. It's set
to `/addin/`, which matches this repository.

```ts
const BASE_PATH = '/addin/'; // '/<REPO_NAME>/' for a project site, '/' for a custom domain
```

If you rename the repo, also update the absolute URLs in `index.html`, `public/robots.txt` and
`public/sitemap.xml`.

## Deploying to GitHub Pages

1. On GitHub, go to **Settings → Pages → Source** and choose **GitHub Actions**.
2. Push to `master`.

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs the typecheck, lint, tests and
build, and only deploys if they all pass. Your site will be at
`https://muhdashiq.com/addin/`, because the custom domain on your `muhdashiq.github.io` repo also applies to project sites.

## Giving the site its own domain

The site currently lives under your account's domain. To move it to a domain of its own:

1. Set `BASE_PATH` to `'/'` in `vite.config.ts`.
2. Create `public/CNAME` containing just your domain, for example `addin.in`.
3. Update the absolute URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml`.
4. Point your DNS at GitHub Pages: a `CNAME` record to `muhdashiq.github.io` for a subdomain, or
   GitHub's `A` records for an apex domain.
5. Enter the domain under **Settings → Pages → Custom domain**, then turn on **Enforce HTTPS**.

Crawlers only read `robots.txt` at the root of a domain, so the copy in `public/` starts to matter
once you have a custom domain.

## How the page is put together

- **Worlds and eras:** each section sets `data-world` (paper, hinge, dusk, screen, night) and
  `data-era` (gingerbread, holo, modern). Colours, buttons and type all come from the tokens in
  [`src/styles/tokens.css`](src/styles/tokens.css), so the theme, the eras and the retro skin never
  need changes inside components.
- **Motion:** GSAP runs through `useGSAP` with a scope, so cleanup is automatic. Shared eases and
  durations are in [`src/lib/motion.ts`](src/lib/motion.ts). Lenis is synced to ScrollTrigger in
  `SmoothScrollProvider`.
- **Reduced motion:** the preloader, Lenis, pinning, WebGL and the custom cursor all switch off, and
  the static content is fully readable. Keep that working: the section tests render everything in
  this mode.
- **3D:** `NetworkStage` chooses between the lazy-loaded WebGL scene and the SVG fallback, and pauses
  the scene when it's off-screen or the tab is hidden.
- **3D bundle size:** `vite.config.ts` points `three` at `src/three/three-slim.ts`, which lists only the
  classes the scene uses. That keeps the lazy 3D chunk under about 200 KB gzipped. If you use a new
  three.js class or JSX element, add it to that file, or R3F will report that it's missing.
