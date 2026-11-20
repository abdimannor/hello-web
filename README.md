# Hello Web

My first HTML page, from 2023, written at the very start of a web course. The text is in Swedish, and each line describes the element it sits in: a large heading, a line of body text, a red line, a medium heading, a link, a small centred heading, and a kitten picture next to a line in Comic Sans. The point was to see what each basic tag does on its own before any stylesheet came into it.

## The reworked version

The page has been rebuilt as a small, cleanly typeset page. The Swedish text is unchanged; the markup and styling around it are new. The original is in the git history (the commit before `rework/2026-11`).

- **Heading outline.** The original went `<h1>`, `<h3>`, `<h5>`, choosing levels by how big they looked. It now goes `<h1>`, `<h2>`, `<h3>`, and the sizes come from CSS.
- **External stylesheet.** The inline `style` attributes are gone. The red line uses a `.red` class and all styling lives in `style.css`.
- **The kitten as a figure.** The picture and its sentence sit in a `<figure>` with a `<figcaption>`, which keeps its Comic Sans. The image has width and height set, so the page does not jump while it loads.
- **Responsive.** One readable column with fluid type; the figure stacks on narrow screens.
- A short footer note says the page is reworked from the original.

## Open it locally

No build step or server is needed. Clone the repository and open `index.html` in a browser:

```
git clone https://github.com/abdimannor/hello-web.git
cd hello-web
open index.html
```

On Windows or Linux, double-click the file or drag it into a browser window instead of `open`.

Live at [hello-web-kappa.vercel.app](https://hello-web-kappa.vercel.app/), hosted on Vercel and open to everyone. Every push to `master` redeploys it.

## License

MIT, see [LICENSE](LICENSE).
