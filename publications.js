/*
 * Renders the Publications section from window.PUBLICATIONS (see publications-data.js).
 * Builds one numbered list per category (continuous numbering across all
 * categories) and, per item: a title that links to the most current version
 * (journal, or arXiv for preprints), an "Abstract" button that rolls the abstract
 * open, a status badge (label), and — for non-preprints — a linked arXiv logo.
 * Abstracts are typeset by MathJax lazily the first time they open, which avoids
 * MathJax measuring math while collapsed.
 */
(function () {
  function el(tag, opts) {
    const e = document.createElement(tag);
    if (!opts) return e;
    if (opts.class) e.className = opts.class;
    if (opts.text != null) e.textContent = opts.text;
    if (opts.href) { e.href = opts.href; e.target = '_blank'; e.rel = 'noopener'; }
    if (opts.attrs) for (const k in opts.attrs) e.setAttribute(k, opts.attrs[k]);
    return e;
  }

  function primaryUrl(item) {
    if (item.url) return item.url;
    if (item.arxiv) return 'https://arxiv.org/abs/' + item.arxiv;
    if (item.doi) return 'https://doi.org/' + item.doi;
    return null;
  }

  // Small arXiv wordmark ("arXiv" with the signature red X), linked to the paper.
  function arxivLogo(id) {
    const a = el('a', { class: 'pub-arxiv', href: 'https://arxiv.org/abs/' + id, attrs: { title: 'arXiv:' + id, 'aria-label': 'arXiv:' + id } });
    a.appendChild(document.createTextNode('ar'));
    a.appendChild(el('span', { class: 'pub-arxiv-x', text: 'X' }));
    a.appendChild(document.createTextNode('iv'));
    return a;
  }

  // Build the roll-down abstract (grid 0fr -> 1fr) and return it with a flip fn.
  function makeAbstract(abstract, onState) {
    const outer = el('div', { class: 'pub-abstract-wrap' });
    const clip = el('div', { class: 'pub-abstract-clip' });
    const box = el('div', { class: 'pub-abstract' });
    box.textContent = abstract;
    clip.appendChild(box);
    outer.appendChild(clip);

    function setOpen(open) {
      outer.classList.toggle('is-open', open);
      if (onState) onState(open); // lets the caller flip the title's ▸/▾ marker
    }
    let typeset = false;
    function flip() {
      if (outer.classList.contains('is-open')) {
        setOpen(false);
      } else if (!typeset && window.MathJax && window.MathJax.typesetPromise) {
        // Typeset first (while collapsed) so the roll animates to the final height.
        window.MathJax.typesetPromise([box]).then(function () { typeset = true; setOpen(true); });
      } else {
        setOpen(true);
      }
    }
    return { wrapper: outer, flip: flip };
  }

  function renderItem(item) {
    const li = el('li', { class: 'pub-item' });

    // Authors.
    li.appendChild(document.createTextNode(item.authors.join(', ') + '.'));
    li.appendChild(el('br'));

    // Title — links to the most current version (journal for published/in press,
    // arXiv for preprints).
    const url = primaryUrl(item);
    li.appendChild(url
      ? el('a', { class: 'pub-title', text: item.title, href: url })
      : el('span', { class: 'pub-title', text: item.title }));
    li.appendChild(document.createTextNode('.'));

    // "Abstract" button (before the status badge) — opens the roll-down abstract.
    let abstractWrap = null;
    if (item.abstract && item.abstract.trim()) {
      const btn = el('span', { class: 'pub-abstract-btn', text: 'Abstract', attrs: { role: 'button', tabindex: '0', 'aria-label': 'Toggle abstract' } });
      const a = makeAbstract(item.abstract, function (open) { btn.classList.toggle('is-open', open); });
      btn.addEventListener('click', a.flip);
      btn.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); a.flip(); }
      });
      li.appendChild(btn);
      abstractWrap = a.wrapper;
    }

    // Status badge (plain label).
    li.appendChild(el('span', {
      class: 'pub-badge pub-badge--' + item.status.replace(/\s+/g, '-'),
      text: item.status
    }));

    // arXiv logo only for non-preprints — a preprint's title already links to arXiv.
    if (item.arxiv && item.status !== 'preprint') {
      li.appendChild(arxivLogo(item.arxiv));
    }
    li.appendChild(el('br'));

    // Reference line. Preprints show no reference line at all.
    let ref;
    if (item.status === 'preprint') {
      ref = '';
    } else {
      ref = (item.venue && item.venue !== 'arXiv preprint')
        ? item.venue + ' ' + item.details
        : item.details;
      // Drop a redundant "in press" / "to appear" phrase — the badge conveys it.
      ref = ref.replace(/,?\s*\b(?:in press|to appear)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
    }
    if (ref) {
      // Bold the journal volume (the number right before the "(year)"), as is
      // customary in LaTeX/amsart bibliographies.
      const refSpan = el('span', { class: 'pub-ref' });
      const m = ref.match(/^(.*?)(\d+)(\s+\(\d{4}\).*)$/);
      if (m) {
        refSpan.appendChild(document.createTextNode(m[1]));
        refSpan.appendChild(el('b', { class: 'pub-vol', text: m[2] }));
        refSpan.appendChild(document.createTextNode(m[3]));
      } else {
        refSpan.textContent = ref;
      }
      li.appendChild(refSpan);
    }

    // The abstract rolls down below the entry.
    if (abstractWrap) li.appendChild(abstractWrap);

    return li;
  }

  function render() {
    const data = window.PUBLICATIONS;
    const container = document.getElementById('publications-container');
    if (!data || !container) return;
    container.textContent = '';

    // Display order of the categories (independent of their order in the data
    // file). Change this list to reorder the sections on the page.
    var ORDER = ['prepublications', 'monographs', 'publications', 'proceedings'];
    var cats = data.categories.slice().sort(function (a, b) {
      var ia = ORDER.indexOf(a.id); if (ia < 0) ia = ORDER.length;
      var ib = ORDER.indexOf(b.id); if (ib < 0) ib = ORDER.length;
      return ia - ib;
    });

    let counter = 0;
    cats.forEach(function (cat) {
      const lead = el('p', { class: 'pub-leadin' });
      lead.appendChild(el('b', { text: cat.title + '.' }));
      container.appendChild(lead);

      const ol = el('ol', { class: 'pub-list' });
      ol.setAttribute('start', String(counter + 1));
      cat.items.forEach(function (item) {
        ol.appendChild(renderItem(item));
        counter++;
      });
      container.appendChild(ol);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
