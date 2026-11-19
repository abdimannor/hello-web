# Hello Web

My first HTML page, from 2023, written at the very start of a web course. The text is in Swedish, and each line describes the element it sits in: a large heading, a line of body text, a red line, a medium heading, a link, a small centred heading, and a kitten picture next to a line in Comic Sans. The point was to see what each basic tag does on its own before any stylesheet came into it.

## What to look at

Everything is in `index.html`, lines 17 to 24.

- **Heading levels.** The page goes `<h1>`, then `<h3>`, then `<h5>`. The levels were chosen for how big the text looks, not for the outline of the document. Later exercises separate the two: headings for structure, CSS for size.
- **Inline styles.** The red paragraph (`style="color:red;"`, line 19) and the Comic Sans paragraph (line 24) are the first CSS in these exercises, written straight on the element. The [dress-code](https://github.com/abdimannor/dress-code) exercise compares this with the other two ways of adding CSS.
- **An image inside a paragraph.** `katt.jpg` sits inline at the start of a `<p>`, so the sentence continues on the same line as the picture instead of starting below it.
- **A plain link** to Aftonbladet (line 21), with no styling, so it shows the browser's default blue and underline.
- **Centring.** The original used the `<center>` tag, which is obsolete in HTML5. It is now `text-align: center` on the `<h5>`, which looks the same.

The image also gained alt text, which the original lacked.

## Open it locally

No build step or server is needed. Clone the repository and open `index.html` in a browser:

```
git clone https://github.com/abdimannor/hello-web.git
cd hello-web
open index.html
```

On Windows or Linux, double-click the file or drag it into a browser window instead of `open`.

There is no live demo. The repository is private and GitHub Pages is not enabled for it, so the Pages workflow has nothing to publish to.

## License

MIT, see [LICENSE](LICENSE).
