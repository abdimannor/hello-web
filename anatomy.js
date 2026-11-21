/* Anatomy: how a browser and a screen reader read the 2023 page.
   The source is parsed with DOMParser and walked here, so every view is computed, not drawn by hand. */
(() => {
  'use strict';
  const root = document.getElementById('anatomy');
  const ORIGINAL = window.HELLO_ORIGINAL;
  if (!root || !ORIGINAL) return;

  // The same text as 2023, written with semantic elements (as on the lesson page today).
  const SEMANTIC = [
    '<!DOCTYPE html>',
    '<html lang="sv">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <title>Mahads HTML</title>',
    '</head>',
    '<body>',
    '  <main>',
    '    <h1>Hej och välkommen, detta är en stor rubrik</h1>',
    '    <p>Och detta är vanlig löpande text (brödtext)</p>',
    '    <p class="red">Hur gör man när man vill ha 2 olika rader med vanlig löpande text, där andra raden är röd?</p>',
    '    <h2>Ibland vill man ha en mellanstor rubrik</h2>',
    '    <p><a href="https://www.aftonbladet.se">och ibland vill man läsa nyheterna på Aftonbladets hemsida</a></p>',
    '    <h3>Ibland vill man ha en mindre centrerad rubrik</h3>',
    '    <figure>',
    '      <img src="katt.jpg" alt="En liten kattunge som tittar in i kameran">',
    '      <figcaption>Ibland vill man bara titta på en söt kattunge, men använda den snyggare fonten Comic Sans Ms</figcaption>',
    '    </figure>',
    '  </main>',
    '</body>',
    '</html>',
    ''
  ].join('\n');
  const SOURCES = { '2023': ORIGINAL.replace(/\t/g, '  '), semantic: SEMANTIC };

  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const squash = (s) => s.replace(/\s+/g, ' ').trim();

  /* ---- role and name, only for the elements that occur on these two pages (HTML-AAM 3.5) ---- */
  function roleOf(n) {
    const t = n.localName;
    if (/^h[1-6]$/.test(t)) return { role: 'heading', level: Number(t[1]) };
    if (t === 'p') return { role: 'paragraph' };
    if (t === 'a') return n.hasAttribute('href') ? { role: 'link' } : { role: 'generic' };
    if (t === 'img') {
      if (n.hasAttribute('alt') && n.getAttribute('alt').trim() === '') return { role: 'presentation' };
      return { role: 'img' };
    }
    if (t === 'main') return { role: 'main', landmark: true };
    if (t === 'figure') return { role: 'figure' };
    return { role: 'generic' }; // html, body, center, figcaption, div: no announced role
  }
  // Accessible name: alt for img (HTML-AAM 4.1.6), content for link and heading (accname 2F), figcaption for figure.
  function nameOf(n, r) {
    if (r.role === 'img') return n.hasAttribute('alt') ? squash(n.getAttribute('alt')) : '';
    if (r.role === 'link' || r.role === 'heading') return squash(n.textContent);
    if (r.role === 'figure') { const c = n.querySelector(':scope > figcaption'); return c ? squash(c.textContent) : ''; }
    return '';
  }

  /* ---- 1. DOM tree ---- */
  function domTree(node) {
    const li = el('li');
    if (node.nodeType === 3) {
      const t = squash(node.data);
      li.className = 'dom-text';
      li.append(el('span', 'dom-q', '"' + (t.length > 44 ? t.slice(0, 44) + '…' : t) + '"'));
      return li;
    }
    const label = el('span', 'dom-el');
    label.append(el('span', 'dom-tag' + (/^(center|h5)$/.test(node.localName) ? ' is-legacy' : ''), node.localName));
    for (const a of node.attributes) label.append(el('span', 'dom-attr', ' ' + a.name + (a.value ? '="' + (a.value.length > 24 ? a.value.slice(0, 24) + '…' : a.value) + '"' : '')));
    li.append(label);
    const kids = [...node.childNodes].filter((c) => c.nodeType === 1 || (c.nodeType === 3 && c.data.trim()));
    if (kids.length) { const ul = el('ul'); kids.forEach((c) => ul.append(domTree(c))); li.append(ul); }
    return li;
  }

  /* ---- 2. outline, 3. landmarks, 4. accessibility tree and announcements ---- */
  function axWalk(node, out, depth) {
    for (const c of node.children) {
      const r = roleOf(c);
      const name = nameOf(c, r);
      const shown = r.role !== 'generic' && r.role !== 'presentation';
      if (shown) out.push({ depth, el: c, ...r, name, text: r.role === 'paragraph' ? squash(c.textContent) : '' });
      if (r.role === 'heading' || r.role === 'img' || r.role === 'presentation') continue;
      axWalk(c, out, shown ? depth + 1 : depth);
    }
    return out;
  }
  const ROLE_SV = { heading: 'rubrik', paragraph: 'stycke', link: 'länk', img: 'bild', main: 'huvudinnehåll', figure: 'figur' };
  function announce(x, doc) {
    if (x.role === 'heading') return ROLE_SV.heading + ' nivå ' + x.level + ', ' + x.name;
    if (x.role === 'link') return ROLE_SV.link + ', ' + x.name;
    if (x.role === 'img') return x.name ? ROLE_SV.img + ', ' + x.name : ROLE_SV.img + ', inget namn (kanske läses filnamnet: ' + x.el.getAttribute('src') + ')';
    if (x.role === 'main') return 'landmärke ' + ROLE_SV.main;
    if (x.role === 'figure') return ROLE_SV.figure + (x.name ? ', ' + x.name : '');
    if (x.role === 'paragraph') return x.text;
    return x.role;
  }

  function render(which) {
    const src = SOURCES[which];
    const doc = new DOMParser().parseFromString(src, 'text/html');
    root.dataset.version = which;
    root.querySelectorAll('[data-version-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.versionBtn === which)));

    root.querySelector('#ana-source').textContent = src;

    const dom = root.querySelector('#ana-dom');
    dom.replaceChildren(); const ul = el('ul', 'dom-root'); ul.append(domTree(doc.documentElement)); dom.append(ul);

    const ax = axWalk(doc.body, [], 0);

    // Outline: headings in order, with the skip rule from the HTML spec.
    const outline = root.querySelector('#ana-outline');
    outline.replaceChildren();
    let prev = null, skips = 0;
    ax.filter((x) => x.role === 'heading').forEach((h) => {
      const li = el('li', 'out-h'); li.style.setProperty('--lvl', h.level);
      li.append(el('span', 'out-lvl', 'h' + h.level), el('span', 'out-name', h.name));
      if (prev && h.level > prev + 1) { skips++; li.classList.add('is-skip'); li.append(el('span', 'out-warn', 'hoppar över ' + Array.from({ length: h.level - prev - 1 }, (_, i) => 'h' + (prev + 1 + i)).join(', '))); }
      prev = h.level; outline.append(li);
    });

    const lm = root.querySelector('#ana-landmarks');
    lm.replaceChildren();
    const marks = ax.filter((x) => x.landmark);
    if (!marks.length) lm.append(el('li', 'lm-none', 'Inga landmärken. Det finns inget att hoppa till.'));
    marks.forEach((m) => { const li = el('li'); li.append(el('span', 'lm-role', m.role), el('span', 'lm-el', '<' + m.el.localName + '>')); lm.append(li); });

    const tree = root.querySelector('#ana-ax');
    tree.replaceChildren();
    ax.forEach((x) => {
      const li = el('li', 'ax-node'); li.style.setProperty('--d', x.depth);
      li.append(el('span', 'ax-role', x.role + (x.level ? ' (nivå ' + x.level + ')' : '')));
      li.append(el('span', 'ax-name', x.role === 'paragraph' ? '' : (x.name ? '"' + x.name + '"' : 'inget namn')));
      if (x.role === 'img' && !x.name) li.classList.add('is-warn');
      tree.append(li);
    });

    const sr = root.querySelector('#ana-sr');
    sr.replaceChildren();
    const lang = doc.documentElement.getAttribute('lang');
    sr.append(el('li', 'sr-doc', 'webbsida, ' + (doc.title || 'utan titel') + (lang ? '' : ' (språk okänt: inget lang, rösten gissar)')));
    ax.forEach((x) => { const li = el('li', 'sr-line', announce(x, doc)); if (x.role === 'img' && !x.name) li.classList.add('is-warn'); sr.append(li); });

    const imgs = ax.filter((x) => x.role === 'img');
    const facts = [
      ['Element i DOM', doc.querySelectorAll('*').length],
      ['Noder i tillgänglighetsträdet', ax.length],
      ['Hopp i rubrikordningen', skips],
      ['Landmärken', marks.length],
      ['Bilder utan namn', imgs.filter((x) => !x.name).length],
      ['lang på <html>', lang ? lang : 'saknas']
    ];
    const f = root.querySelector('#ana-facts'); f.replaceChildren();
    facts.forEach(([k, v]) => { const d = el('div'); d.append(el('dt', null, k), el('dd', null, String(v))); f.append(d); });
    root.querySelector('#ana-status').textContent = (which === '2023' ? 'Visar 2023' : 'Visar den semantiska versionen') + ': ' + ax.length + ' noder, ' + skips + ' hopp i rubrikerna, ' + marks.length + ' landmärken.';
  }

  root.querySelectorAll('[data-version-btn]').forEach((b) => b.addEventListener('click', () => render(b.dataset.versionBtn)));
  root.hidden = false;
  render('2023');
})();
