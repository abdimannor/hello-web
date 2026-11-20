/* Then and now: the 2023 original beside the reworked page. */
(() => {
  'use strict';
  const ORIGINAL = "<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset=\"utf-8\">\n\t<title>Mahads HTML<\/title>\n<\/head>\n<body>\n\t<h1>Hej och välkommen, detta är en stor rubrik<\/h1>\n\t<p>Och detta är vanlig löpande text (brödtext)<\/p>\n\t<p style=\"color:red;\">Hur gör man när man vill ha 2 olika rader med vanlig löpande text, där andra raden är röd?<\/p>\n\t<h3>Ibland vill man ha en mellanstor rubrik<\/h3>\n\t<a href=\"http://www.aftonbladet.se\">och ibland vill man läsa nyheterna på Aftonbladets hemsida<\/a>\n\n\t<center><h5>Ibland vill man ha en mindre centrerad rubrik<\/h5><\/center>\n\t<p style=\"font-family: 'Comic Sans Ms';\"><img src=\"katt.jpg\"> Ibland vill man bara titta på en söt kattunge, men använda den snyggare fonten Comic Sans Ms<\/p>\n<\/body>\n<\/html>\n";

  window.HELLO_ORIGINAL = ORIGINAL;

  // Inside the 'now' frame the lab itself is hidden, so the page does not nest forever.
  if (window.self !== window.top) {
    document.documentElement.classList.add('is-embedded');
    return;
  }

  const lab = document.getElementById('lab');
  if (!lab) return;
  lab.hidden = false;

  /* ---- a tiny HTML highlighter: tags, attribute names, values, comments, text ---- */
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function highlight(src) {
    let out = '';
    const re = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][^>]*>/g;
    let last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      const tok = m[0];
      if (tok.startsWith('<!--')) out += '<span class="t-com">' + esc(tok) + '</span>';
      else if (/^<!DOCTYPE/i.test(tok)) out += '<span class="t-doc">' + esc(tok) + '</span>';
      else {
        const t = /^<(\/?)([a-zA-Z0-9]+)([\s\S]*?)(\/?)>$/.exec(tok);
        const name = t[2];
        const legacy = /^(center|font|h5)$/i.test(name) ? ' t-legacy' : '';
        let attrs = esc(t[3]).replace(/([a-zA-Z-:]+)(=)(&quot;|")?("[^"]*"|'[^']*')/g,
          (all, a, eq, _q, v) => '<span class="t-attr' + (a === 'style' ? ' t-inline' : '') + '">' + a + '</span>' + eq + '<span class="t-val">' + v + '</span>');
        out += '<span class="t-punc">&lt;' + t[1] + '</span><span class="t-tag' + legacy + '">' + name + '</span>' + attrs + '<span class="t-punc">' + t[4] + '&gt;</span>';
      }
      last = re.lastIndex;
    }
    out += esc(src.slice(last));
    return out.split('\n').map((l, i) => '<span class="ln" data-n="' + (i + 1) + '">' + (l || ' ') + '</span>').join('');
  }

  const code = lab.querySelector('#then-code');
  code.innerHTML = highlight(ORIGINAL.replace(/\t/g, '  '));

  /* ---- the two live frames ---- */
  const thenFrame = lab.querySelector('#frame-then');
  const nowFrame = lab.querySelector('#frame-now');
  thenFrame.srcdoc = ORIGINAL.replace('<head>', '<head><base href="' + new URL('.', location.href).href + '">');
  nowFrame.src = 'index.html';

  const stage = lab.querySelector('.stage');
  const slider = lab.querySelector('#wipe');
  const out = lab.querySelector('#wipe-out');
  function setWipe(v) {
    stage.style.setProperty('--wipe', v + '%');
    out.value = v >= 99 ? 'Bara 2023' : v <= 1 ? 'Bara 2026' : Math.round(v) + ' % 2023, ' + Math.round(100 - v) + ' % 2026';
    lab.querySelectorAll('[data-wipe]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.wipe) === Number(v))));
  }
  slider.addEventListener('input', () => setWipe(Number(slider.value)));
  lab.querySelectorAll('[data-wipe]').forEach((b) => b.addEventListener('click', () => {
    slider.value = b.dataset.wipe; setWipe(Number(b.dataset.wipe));
  }));
  setWipe(Number(slider.value));

  /* ---- what changed: click a note to light up the matching source line ---- */
  lab.querySelectorAll('[data-line]').forEach((b) => b.addEventListener('click', () => {
    code.querySelectorAll('.ln.is-hit').forEach((l) => l.classList.remove('is-hit'));
    const hit = code.querySelector('.ln[data-n="' + b.dataset.line + '"]');
    if (hit) { hit.classList.add('is-hit'); hit.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  }));
})();
