# Hello Web

Live: [hello-web-kappa.vercel.app](https://hello-web-kappa.vercel.app/) · Svenska: [README.sv.md](README.sv.md)

Lesson 1 of 4 in a small web course built from my first coursework pages from 2023. Lektion 1: Hello Web (this one) · Lektion 2: [Tech World](https://tech-world-zeta.vercel.app/) · Lektion 3: [Link Lab](https://link-lab-flax.vercel.app/) · Lektion 4: [Dress Code](https://dress-code-bay.vercel.app/)

## What the lesson teaches

How a page is *read*, not only how it looks. A browser turns the source into a DOM tree; from that tree it builds an accessibility tree of roles and names, and that second tree is what a screen reader announces. Headings become a navigable outline, `<main>` becomes a landmark, an image's `alt` becomes its name. The lesson shows all of this on one real, small page.

## Where it came from

The page is my first HTML exercise from 2023, written at the very start of a web course. Each Swedish line describes the element it sits in: a large heading, body text, a red line, a medium heading, a link, a small centred heading, and a kitten picture beside a line in Comic Sans. It was written for the eye: heading levels `h1`, `h3`, `h5` were picked by size, the centring came from `<center>`, and the image had no `alt`. Those choices look fine on screen and are exactly what changes the page for a screen reader, which is why the lesson is built around it. The original source is kept verbatim in `lab.js`.

## On the site

- **The page** (`index.html`): the 2023 text, rebuilt with semantic markup and one stylesheet.
- **Then and now:** the 2023 original beside today's page with a wipe slider and notes on each change.
- **Laga min första sida:** fix the original in an editor with live preview; three checks (heading order, alt text, no `<center>`).
- **Anatomi** (`anatomi.html`, new): the 2023 source shown as four computed layers, with a toggle to a semantic version of the same text:
  1. the DOM tree (from `DOMParser`),
  2. the heading outline, flagging skipped levels per the [HTML standard](https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines-2),
  3. landmarks,
  4. the accessibility tree and a screen-reader style reading order.

  Roles and names are computed in `anatomy.js` for the elements that occur on the two pages, following [HTML-AAM](https://www.w3.org/TR/html-aam-1.0/) and [accname 1.2](https://www.w3.org/TR/accname-1.2/); every rule is linked on the page. It is a teaching model for these elements, not a full implementation, and the spoken lines are approximate, since VoiceOver, NVDA and JAWS phrase things differently.

The course bar, next-lesson block and motion switch come from `course.css` and `course.js`, identical in all four repos. Animation follows the motion switch, so it stays off when the system asks for reduced motion until you turn it on.

## Run it

No build step. Serve the folder (the anatomy page parses with scripts, which is fine from `file://`, but the frames in the lab want a server):

```
git clone https://github.com/abdimannor/hello-web.git
cd hello-web
python3 -m http.server 8751
```

Then open http://127.0.0.1:8751/.

## Test it

```
npm ci
npx playwright install chromium
npm test
```

The Playwright suite loads every page and fails on console errors or failed requests, runs axe-core on both pages (and on the anatomy page's semantic view), checks the anatomy views in both versions (outline skips, landmarks, image names, the 2023 source matching `lab.js`), and checks the motion switch under `reducedMotion: 'reduce'`. CI runs it in `.github/workflows/test.yml`, next to the HTML checker in `check.yml`.

The site is hosted on Vercel; every push to `master` redeploys it.

## License

MIT, see [LICENSE](LICENSE).
