/*
 * Publication update bot.
 *
 * Discovers new works via OpenAlex (keyed by the author's ORCID, so there is no
 * risk of picking up a different "Mathias Braun"), compares them against
 * publications-data.js, fetches a clean LaTeX abstract from arXiv for anything
 * new, inserts best-guess entries (flagged "_needsReview": true), and rewrites
 * publications-data.js. The GitHub workflow then opens a pull request so the
 * changes can be reviewed and merged.
 *
 * Runs on GitHub Actions (Node 20, global fetch). No local install needed.
 */
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'publications-data.js');
const SUMMARY_PATH = path.join(__dirname, '..', 'pr-summary.md');
const PUBLICATIONS = require(DATA_PATH);

const ORCID = PUBLICATIONS.meta && PUBLICATIONS.meta.orcid;
const MAILTO = 'publications-bot@users.noreply.github.com';

const normTitle = (t) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const normDoi = (d) => (d || '').toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, '');

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function slugify(title) {
  return normTitle(title).slice(0, 48) || 'work-' + Date.now();
}

// --- Gather what we already have -------------------------------------------
function knownKeys() {
  const arxiv = new Set();
  const doi = new Set();
  const title = new Set();
  for (const cat of PUBLICATIONS.categories) {
    for (const it of cat.items) {
      if (it.arxiv) arxiv.add(it.arxiv.replace(/v\d+$/, ''));
      if (it.doi) doi.add(normDoi(it.doi));
      if (it.title) title.add(normTitle(it.title));
    }
  }
  return { arxiv, doi, title };
}

// --- Fetch helpers ----------------------------------------------------------
async function fetchJSON(url) {
  const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
  return r.json();
}

async function fetchArxivAbstract(id) {
  try {
    const r = await fetch(`http://export.arxiv.org/api/query?id_list=${id}`);
    const xml = await r.text();
    const m = xml.match(/<entry>[\s\S]*?<summary>([\s\S]*?)<\/summary>/);
    if (!m) return '';
    return decodeEntities(m[1].replace(/\s+/g, ' ').trim());
  } catch (e) {
    console.warn(`arXiv abstract fetch failed for ${id}: ${e.message}`);
    return '';
  }
}

function deriveArxivId(work) {
  const doi = normDoi(work.doi);
  const m1 = doi.match(/^10\.48550\/arxiv\.(.+)$/i);
  if (m1) return m1[1];
  const locs = work.locations || [];
  for (const loc of locs) {
    const u = (loc && (loc.landing_page_url || loc.pdf_url)) || '';
    const m = u.match(/arxiv\.org\/(?:abs|pdf)\/([0-9]{4}\.[0-9]{4,5})/i);
    if (m) return m[1];
  }
  return null;
}

// --- Main -------------------------------------------------------------------
async function main() {
  if (!ORCID) throw new Error('No ORCID in publications-data.js meta.');
  const known = knownKeys();

  const url = `https://api.openalex.org/works?filter=author.orcid:${ORCID}` +
              `&per-page=200&mailto=${MAILTO}`;
  const data = await fetchJSON(url);
  const works = data.results || [];
  console.log(`OpenAlex returned ${works.length} works for ORCID ${ORCID}.`);

  const added = [];
  for (const w of works) {
    const title = w.title || w.display_name;
    if (!title) continue;
    const arxiv = deriveArxivId(w);
    const doi = normDoi(w.doi);
    const nt = normTitle(title);

    const isKnown =
      (arxiv && known.arxiv.has(arxiv.replace(/v\d+$/, ''))) ||
      (doi && known.doi.has(doi)) ||
      known.title.has(nt);
    if (isKnown) continue;

    // New work — build a best-guess entry for review.
    const isPreprint = w.type === 'preprint' ||
                       (!!arxiv && (!doi || /arxiv/i.test(doi)));
    const venueName =
      (w.primary_location && w.primary_location.source &&
       w.primary_location.source.display_name) ||
      (isPreprint ? 'arXiv preprint' : 'Journal');

    const item = {
      id: slugify(title),
      authors: (w.authorships || []).map((a) => a.author && a.author.display_name).filter(Boolean),
      title,
      venue: isPreprint ? 'arXiv preprint' : venueName,
      details: isPreprint && arxiv ? `arXiv:${arxiv}` : (w.publication_year ? `${w.publication_year}` : ''),
      year: w.publication_year || null,
      status: isPreprint ? 'preprint' : 'published',
      url: doi ? `https://doi.org/${doi}` : (arxiv ? `https://arxiv.org/abs/${arxiv}` : null),
      doi: doi && !/arxiv/i.test(doi) ? doi : null,
      arxiv: arxiv || null,
      abstract: arxiv ? await fetchArxivAbstract(arxiv) : '',
      _needsReview: true
    };

    const catId = isPreprint ? 'prepublications' : 'publications';
    const cat = PUBLICATIONS.categories.find((c) => c.id === catId);
    cat.items.unshift(item);
    added.push({ ...item, catId });
    console.log(`+ NEW (${catId}): ${title}`);
  }

  if (added.length === 0) {
    console.log('No new publications found. Nothing to do.');
    return;
  }

  // Stamp and rewrite the data file.
  PUBLICATIONS.meta.lastUpdated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(DATA_PATH, serialize(PUBLICATIONS));

  // PR summary for humans.
  const lines = [
    `The bot found **${added.length}** new work(s) via OpenAlex/ORCID and added them to \`publications-data.js\`.`,
    '',
    '**Please verify before merging** — category, status, and the exact bibliographic reference are best-guesses:',
    ''
  ];
  for (const a of added) {
    lines.push(`- **${a.title}**`);
    lines.push(`  - guessed category: \`${a.catId}\`, status: \`${a.status}\``);
    if (a.arxiv) lines.push(`  - arXiv: [${a.arxiv}](https://arxiv.org/abs/${a.arxiv})`);
    if (a.doi) lines.push(`  - DOI: [${a.doi}](https://doi.org/${a.doi})`);
    lines.push(`  - abstract fetched: ${a.abstract ? 'yes (from arXiv)' : 'no — add manually'}`);
    lines.push('');
  }
  lines.push('Each new entry is flagged `"_needsReview": true`. Remove that flag and fix the `details`/`venue`/`status` once checked.');
  fs.writeFileSync(SUMMARY_PATH, lines.join('\n'));
  console.log(`Wrote ${added.length} new item(s) and pr-summary.md.`);
}

function serialize(data) {
  const header =
`/*
 * Publications database — the single source of truth for the Publications section.
 * Rendered into the page by publications.js. Edited by hand or by the update bot
 * (scripts/update-publications.cjs via .github/workflows/update-publications.yml).
 *
 * Each item: authors[], title, venue, details, year, status
 * (published | in press | preprint), url, doi, arxiv, abstract.
 * Bot-added items carry "_needsReview": true until a human verifies them.
 */
`;
  return header +
    'const PUBLICATIONS = ' + JSON.stringify(data, null, 2) + ';\n\n' +
    "if (typeof window !== 'undefined') window.PUBLICATIONS = PUBLICATIONS;\n" +
    "if (typeof module !== 'undefined' && module.exports) module.exports = PUBLICATIONS;\n";
}

main().catch((e) => { console.error(e); process.exit(1); });
