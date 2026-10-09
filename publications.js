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

  function arxivButton(id) {
    return el('a', { class: 'pub-arxiv-btn', text: 'arXiv', href: 'https://arxiv.org/abs/' + id, attrs: { title: 'arXiv:' + id, 'aria-label': 'arXiv:' + id } });
  }

  function foldWithMap(str) {
    var out = '', map = [];
    for (var i = 0; i < str.length; i++) {
      var d = str[i].normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
      for (var j = 0; j < d.length; j++) { out += d[j]; map.push(i); }
    }
    return { folded: out, map: map };
  }

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

  function glueMathPunctuation(root) {
    root.querySelectorAll('mjx-container').forEach(function (c) {
      if (c.getAttribute('display') === 'true') return;
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

  function uprightCapitalGreek(s) {
    const MAP = {
      'Γ': '\\Gamma ', 'Δ': '\\Delta ', 'Θ': '\\Theta ', 'Λ': '\\Lambda ',
      'Ξ': '\\Xi ', 'Π': '\\Pi ', 'Σ': '\\Sigma ', 'Φ': '\\Phi ',
      'Ψ': '\\Psi ', 'Ω': '\\Omega '
    };
    const fix = function (seg) { return seg.replace(/[ΓΔΘΛΞΠΣΦΨΩ]/g, function (c) { return MAP[c]; }); };
    return s.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\\begin\{[^}]*\}[\s\S]*?\\end\{[^}]*\}/g, fix);
  }

  function makeAbstract(abstract, onState, terms) {
    const outer = el('div', { class: 'pub-abstract-wrap' });
    const clip = el('div', { class: 'pub-abstract-clip' });
    const box = el('div', { class: 'pub-abstract' });
    box.textContent = uprightCapitalGreek(abstract);
    clip.appendChild(box);
    outer.appendChild(clip);

    function setOpen(open) {
      outer.classList.toggle('is-open', open);
      if (onState) onState(open);
    }
    let typeset = false, highlighted = false;
    function reveal() {
      if (!highlighted) { highlightWithin(box, terms || []); highlighted = true; }
      setOpen(true);
    }
    function flip() {
      if (outer.classList.contains('is-open')) {
        setOpen(false);
      } else if (!typeset && window.MathJax && window.MathJax.typesetPromise) {
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

    li.appendChild(highlightFragment(item.authors.join(', '), terms));
    li.appendChild(el('br'));

    const url = primaryUrl(item);
    const titleEl = url
      ? el('a', { class: 'pub-title', href: url })
      : el('span', { class: 'pub-title' });
    titleEl.appendChild(highlightFragment(item.title, terms));
    li.appendChild(titleEl);
    li.appendChild(document.createTextNode(' '));

    if (item.status === 'in press') {
      li.appendChild(el('span', {
        class: 'pub-badge pub-badge--' + item.status.replace(/\s+/g, '-'),
        text: item.status
      }));
    }
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
    if (item.arxiv) {
      li.appendChild(arxivButton(item.arxiv));
    }
    li.appendChild(el('br'));

    let ref;
    if (item.status === 'preprint') {
      ref = '';
    } else {
      ref = (item.venue && item.venue !== 'arXiv preprint')
        ? item.venue + ' ' + item.details
        : item.details;
      ref = ref.replace(/,?\s*\b(?:in press|to appear)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
    }
    if (ref) {
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

    if (abstractWrap) li.appendChild(abstractWrap);

    return li;
  }

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

  function render(query) {
    const data = window.PUBLICATIONS;
    const container = document.getElementById('publications-container');
    if (!data || !container) return;
    container.textContent = '';

    var terms = norm(query).split(/\s+/).filter(Boolean);

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
        orig++;
        if (itemMatches(item, terms)) matched.push({ item: item, num: orig });
      });
      if (!matched.length) return;

      const lead = el('p', { class: 'pub-leadin' });
      lead.appendChild(el('b', { text: cat.title }));
      container.appendChild(lead);

      const ol = el('ol', { class: 'pub-list' });
      matched.forEach(function (m) {
        const li = renderItem(m.item, terms);
        li.setAttribute('value', m.num);
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

    if (window.MathJax && window.MathJax.typesetPromise) {
      var mathBits = Array.prototype.slice.call(container.querySelectorAll('.pub-title, .pub-ref'));
      if (mathBits.length) window.MathJax.typesetPromise(mathBits);
    }
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
