# Hello Web

Live: [hello-web-kappa.vercel.app](https://hello-web-kappa.vercel.app/) · English: [README.md](README.md)

Lektion 1 av 4 i en liten webbkurs byggd på mina första kursuppgifter från 2023. Lektion 1: Hello Web (den här) · Lektion 2: [Tech World](https://tech-world-zeta.vercel.app/) · Lektion 3: [Link Lab](https://link-lab-flax.vercel.app/) · Lektion 4: [Dress Code](https://dress-code-bay.vercel.app/)

## Vad lektionen lär ut

Hur en sida *läses*, inte bara hur den ser ut. Webbläsaren gör om källkoden till ett DOM-träd. Ur det bygger den ett tillgänglighetsträd av roller och namn, och det är det trädet en skärmläsare läser upp. Rubriker blir en struktur man kan hoppa i, `<main>` blir ett landmärke och bildens `alt` blir bildens namn. Lektionen visar allt detta på en riktig, liten sida.

## Var den kommer ifrån

Sidan är min första HTML-uppgift från 2023, skriven i början av en webbkurs. Varje rad beskriver elementet den står i: en stor rubrik, brödtext, en röd rad, en mellanstor rubrik, en länk, en liten centrerad rubrik och en kattunge bredvid en rad i Comic Sans. Den skrevs för ögat: rubriknivåerna `h1`, `h3`, `h5` valdes efter storlek, centreringen kom från `<center>` och bilden saknade `alt`. Det ser bra ut på skärmen men är just det som ändrar sidan för en skärmläsare, och därför är lektionen byggd kring den. Originalkoden ligger oförändrad i `lab.js`.

## På sajten

- **Sidan** (`index.html`): texten från 2023 med semantisk kod och en stilmall.
- **Då och nu:** originalet bredvid dagens sida, med ett reglage och anteckningar om varje ändring.
- **Laga min första sida:** rätta originalet i en editor med förhandsvisning; tre kontroller (rubrikordning, alt-text, ingen `<center>`).
- **Anatomi** (`anatomi.html`, ny): koden från 2023 som fyra uträknade lager, med en knapp för att byta till en semantisk version av samma text: DOM-trädet, rubrikstrukturen (hoppade nivåer markeras enligt [HTML-standarden](https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines-2)), landmärken, och tillgänglighetsträdet med en uppläsning i skärmläsarstil. Roller och namn räknas fram i `anatomy.js` enligt [HTML-AAM](https://www.w3.org/TR/html-aam-1.0/) och [accname 1.2](https://www.w3.org/TR/accname-1.2/), för de element som finns på sidorna. Det är en förenklad modell, och uppläsningen är ungefärlig eftersom VoiceOver, NVDA och JAWS formulerar sig olika.

Kursraden, nästa-lektion-blocket och rörelseknappen kommer från `course.css` och `course.js`, som är likadana i alla fyra repon. Animationer följer rörelseknappen och är avstängda när systemet ber om minskad rörelse, tills du slår på dem.

## Kör den

```
git clone https://github.com/abdimannor/hello-web.git
cd hello-web
python3 -m http.server 8751
```

Öppna sedan http://127.0.0.1:8751/.

## Testa den

```
npm ci
npx playwright install chromium
npm test
```

Playwright-sviten laddar varje sida och fallerar vid konsolfel eller misslyckade anrop, kör axe-core på båda sidorna (och på anatomisidans semantiska vy), kontrollerar anatomivyerna i båda versionerna och testar rörelseknappen med `reducedMotion: 'reduce'`. CI kör den i `.github/workflows/test.yml`, bredvid HTML-kontrollen i `check.yml`.

## Licens

MIT, se [LICENSE](LICENSE).
