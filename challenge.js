/* Challenge: fix the 2023 page. Three checks run on every keystroke. */
(() => {
  'use strict';
  if (window.self !== window.top) return;
  const root = document.getElementById('fix');
  const ORIGINAL = window.HELLO_ORIGINAL;
  if (!root || !ORIGINAL) return;
  root.hidden = false;

  const area = root.querySelector('#fix-code');
  const frame = root.querySelector('#fix-preview');
  const score = root.querySelector('#fix-score');
  const base = '<base href="' + new URL('.', location.href).href + '">';
  const start = ORIGINAL.replace(/\t/g, '  ');

  const checks = {
    order(doc) {
      const hs = [...doc.body.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
      if (!hs.length || hs[0] !== 1) return false;
      return hs.every((n, i) => i === 0 || n <= hs[i - 1] + 1);
    },
    alt(doc) {
      const imgs = [...doc.body.querySelectorAll('img')];
      return imgs.length > 0 && imgs.every((i) => (i.getAttribute('alt') || '').trim().length >= 3);
    },
    center(doc) {
      return !doc.querySelector('center') && /text-align\s*:\s*center/i.test(doc.documentElement.outerHTML);
    },
  };

  let timer = 0;
  function run() {
    const src = area.value;
    const doc = new DOMParser().parseFromString(src, 'text/html');
    let done = 0;
    for (const li of root.querySelectorAll('[data-task]')) {
      const ok = checks[li.dataset.task](doc);
      li.classList.toggle('is-ok', ok);
      li.querySelector('.fix-state').textContent = ok ? 'Klar' : 'Ej klar';
      if (ok) done++;
    }
    score.textContent = done === 3 ? 'Alla tre klara. Sidan är lagad.' : done + ' av 3 klara';
    root.classList.toggle('is-solved', done === 3);
    frame.srcdoc = /<head>/i.test(src) ? src.replace(/<head>/i, '<head>' + base) : base + src;
  }
  area.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 150); });
  root.querySelector('#fix-reset').addEventListener('click', () => { area.value = start; run(); area.focus(); });
  area.value = start;
  run();
})();
