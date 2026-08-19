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

  // arXiv button — styled like the "Abstract" button; links to the paper.
  function arxivButton(id) {
    return el('a', { class: 'pub-arxiv-btn', text: 'arXiv', href: 'https://arxiv.org/abs/' + id, attrs: { title: 'arXiv:' + id, 'aria-label': 'arXiv:' + id } });
  }

  // --- Search highlighting ---------------------------------------------------
  // Fold a string to accent-free lowercase, recording for each output character
  // the index it came from in the original string (so we can map matches back).
  function foldWithMap(str) {
    var out = '', map = [];
    for (var i = 0; i < str.length; i++) {
      var d = str[i].normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
      for (var j = 0; j < d.length; j++) { out += d[j]; map.push(i); }
    }
    return { folded: out, map: map };
  }

  // Fragment of `text` with every occurrence of any term wrapped in <mark class="pub-hl">.
  function highlightFragment(text, terms) {
    var frag = document.createDocumentFragment();
    text = text == null ? '' : String(text);
    if (!terms.length || !text) { frag.appendChild(document.createTextNode(text)); return frag; }
    var fm = foldWithMap(text), ranges = [];
    terms.forEach(function (term) {
      var idx = 0;
      while ((idx = fm.folded.indexOf(term, idx)) >= 0) { ranges.push([idx, idx + term.length]); idx += term.length; }
    });
    if (!ranges.length) { frag.appendChild(document.createTextNode(text)); return frag; }
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    ranges.forEach(function (r) {
      var last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push([r[0], r[1]]);
    });
    var pos = 0;
    merged.forEach(function (r) {
      var oStart = fm.map[r[0]];
      var oEnd = r[1] < fm.map.length ? fm.map[r[1]] : text.length;
      if (oStart > pos) frag.appendChild(document.createTextNode(text.slice(pos, oStart)));
      frag.appendChild(el('mark', { class: 'pub-hl', text: text.slice(oStart, oEnd) }));
      pos = oEnd;
    });
    if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
    return frag;
  }

  // Highlight matches inside already-rendered prose (used when an abstract opens);
  // skips text that is inside math (mjx-container) or an existing mark.
  function highlightWithin(root, terms) {
    if (!terms.length) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), texts = [], n, p, t, skip;
    while ((n = walker.nextNode())) {
      skip = false; p = n.parentNode;
      while (p && p !== root) { t = p.nodeName.toLowerCase(); if (t === 'mjx-container' || t === 'mark') { skip = true; break; } p = p.parentNode; }
      if (!skip && n.nodeValue && n.nodeValue.trim()) texts.push(n);
    }
    texts.forEach(function (node) {
      var frag = highlightFragment(node.nodeValue, terms);
      if (frag.querySelector && frag.querySelector('mark')) node.parentNode.replaceChild(frag, node);
    });
  }

  // Keep trailing punctuation on the same line as the inline formula it follows.
  // MathJax renders each formula as an atomic inline element, and the browser may
  // break right after it, dropping a lone comma/period onto the next line. Wrapping
  // the formula together with the punctuation in a nowrap span prevents that (and
  // also strips any stray space that slipped in before the punctuation).
  function glueMathPunctuation(root) {
    root.querySelectorAll('mjx-container').forEach(function (c) {
      if (c.getAttribute('display') === 'true') return; // skip centered display equations
      const next = c.nextSibling;
      if (!next || next.nodeType !== 3) return;
      const m = next.textContent.match(/^\s*([,.;:!?)]+)/);
      if (!m) return;
      const span = document.createElement('span');
      span.className = 'math-nobreak';
      c.parentNode.insertBefore(span, c);
      span.appendChild(c);
      span.appendChild(document.createTextNode(m[1]));
      next.textContent = next.textContent.slice(m[0].length);
    });
  }

  // Uppercase Greek typed as literal Unicode (Γ, Δ, …) is rendered italic by
  // MathJax, but LaTeX convention sets uppercase Greek upright. Rewrite those to
  // their commands (\Gamma, \Delta, …), which MathJax sets upright — but only
  // inside math regions, so surrounding prose is never touched. Lowercase Greek
  // (γ, μ, …) is left alone: it should stay italic.
  function uprightCapitalGreek(s) {
    const MAP = {
      'Γ': '\\Gamma ', 'Δ': '\\Delta ', 'Θ': '\\Theta ', 'Λ': '\\Lambda ',
      'Ξ': '\\Xi ', 'Π': '\\Pi ', 'Σ': '\\Sigma ', 'Φ': '\\Phi ',
      'Ψ': '\\Psi ', 'Ω': '\\Omega '
    };
    const fix = function (seg) { return seg.replace(/[ΓΔΘΛΞΠΣΦΨΩ]/g, function (c) { return MAP[c]; }); };
    return s.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\\begin\{[^}]*\}[\s\S]*?\\end\{[^}]*\}/g, fix);
  }

  // Build the roll-down abstract (grid 0fr -> 1fr) and return it with a flip fn.
  function makeAbstract(abstract, onState, terms) {
    const outer = el('div', { class: 'pub-abstract-wrap' });
    const clip = el('div', { class: 'pub-abstract-clip' });
    const box = el('div', { class: 'pub-abstract' });
    box.textContent = uprightCapitalGreek(abstract);
    clip.appendChild(box);
    outer.appendChild(clip);

    function setOpen(open) {
      outer.classList.toggle('is-open', open);
      if (onState) onState(open); // lets the caller flip the title's ▸/▾ marker
    }
    let typeset = false, highlighted = false;
    // Only highlight the search terms once the abstract is actually opened.
    function reveal() {
      if (!highlighted) { highlightWithin(box, terms || []); highlighted = true; }
      setOpen(true);
    }
    function flip() {
      if (outer.classList.contains('is-open')) {
        setOpen(false);
      } else if (!typeset && window.MathJax && window.MathJax.typesetPromise) {
        // Typeset first (while collapsed) so the roll animates to the final height.
        window.MathJax.typesetPromise([box]).then(function () { glueMathPunctuation(box); typeset = true; reveal(); });
      } else {
        reveal();
      }
    }
    return { wrapper: outer, flip: flip };
  }

  function renderItem(item, terms) {
    terms = terms || [];
    const li = el('li', { class: 'pub-item' });

    // Authors.
    li.appendChild(highlightFragment(item.authors.join(', '), terms));
    li.appendChild(document.createTextNode('.'));
    li.appendChild(el('br'));

    // Title — links to the most current version (journal for published/in press,
    // arXiv for preprints).
    const url = primaryUrl(item);
    const titleEl = url
      ? el('a', { class: 'pub-title', href: url })
      : el('span', { class: 'pub-title' });
    titleEl.appendChild(highlightFragment(item.title, terms));
    li.appendChild(titleEl);
    li.appendChild(document.createTextNode('. '));

    // Status badge, then the "Abstract" button, then the arXiv logo — all on the
    // title line, in that order.
    li.appendChild(el('span', {
      class: 'pub-badge pub-badge--' + item.status.replace(/\s+/g, '-'),
      text: item.status
    }));
    let abstractWrap = null;
    if (item.abstract && item.abstract.trim()) {
      const btn = el('span', { class: 'pub-abstract-btn', text: 'Abstract', attrs: { role: 'button', tabindex: '0', 'aria-label': 'Toggle abstract' } });
      const a = makeAbstract(item.abstract, function (open) { btn.classList.toggle('is-open', open); }, terms);
      btn.addEventListener('click', a.flip);
      btn.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); a.flip(); }
      });
      li.appendChild(btn);
      abstractWrap = a.wrapper;
    }
    if (item.arxiv && item.status !== 'preprint') {
      li.appendChild(arxivButton(item.arxiv));
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
        refSpan.appendChild(highlightFragment(m[1], terms));
        const vol = el('b', { class: 'pub-vol' });
        vol.appendChild(highlightFragment(m[2], terms));
        refSpan.appendChild(vol);
        refSpan.appendChild(highlightFragment(m[3], terms));
      } else {
        refSpan.appendChild(highlightFragment(ref, terms));
      }
      li.appendChild(refSpan);
    }

    // The abstract rolls down below the entry.
    if (abstractWrap) li.appendChild(abstractWrap);

    return li;
  }

  // Lowercase, accent-folded search text for one item (cached on the item).
  function norm(s) { return String(s == null ? '' : s).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase(); }
  function itemSearchText(item) {
    if (item._search == null) {
      item._search = norm([
        item.authors ? item.authors.join(' ') : '',
        item.title, item.venue, item.details, item.year,
        item.status, item.doi, item.arxiv, item.abstract
      ].filter(Boolean).join(' '));
    }
    return item._search;
  }
  function itemMatches(item, terms) {
    if (!terms.length) return true;
    var t = itemSearchText(item);
    return terms.every(function (term) { return t.indexOf(term) >= 0; });
  }

  // Render the list, filtered to items matching every whitespace-separated word in
  // `query` (searched across authors/title/venue/details/year/status/ids/abstract).
  // An empty query shows everything; numbering runs continuously over shown items.
  function render(query) {
    const data = window.PUBLICATIONS;
    const container = document.getElementById('publications-container');
    if (!data || !container) return;
    container.textContent = '';

    var terms = norm(query).split(/\s+/).filter(Boolean);

    // Display order of the categories (independent of their order in the data
    // file). Change this list to reorder the sections on the page.
    var ORDER = ['prepublications', 'monographs', 'publications', 'proceedings'];
    var cats = data.categories.slice().sort(function (a, b) {
      var ia = ORDER.indexOf(a.id); if (ia < 0) ia = ORDER.length;
      var ib = ORDER.indexOf(b.id); if (ib < 0) ib = ORDER.length;
      return ia - ib;
    });

    var orig = 0, shown = 0;
    cats.forEach(function (cat) {
      var matched = [];
      cat.items.forEach(function (item) {
        orig++;                                  // position in the full (unfiltered) list
        if (itemMatches(item, terms)) matched.push({ item: item, num: orig });
      });
      if (!matched.length) return;               // hide categories that have no matches

      const lead = el('p', { class: 'pub-leadin' });
      lead.appendChild(el('b', { text: cat.title + '.' }));
      container.appendChild(lead);

      const ol = el('ol', { class: 'pub-list' });
      matched.forEach(function (m) {
        const li = renderItem(m.item, terms);
        li.setAttribute('value', m.num);         // keep each item's number from the full bibliography
        ol.appendChild(li);
        shown++;
      });
      container.appendChild(ol);
    });

    if (!shown) {
      container.appendChild(el('p', { class: 'pub-noresults', text: 'No matching publications.' }));
    }
    var countEl = document.getElementById('pub-count');
    if (countEl) countEl.textContent = terms.length ? (shown + ' of ' + orig + ' shown') : '';
  }

  function init() {
    var input = document.getElementById('pub-search');
    render(input ? input.value : '');
    if (input) {
      input.addEventListener('input', function () { render(input.value); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
