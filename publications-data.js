/*
 * Publications database — the single source of truth for the Publications section.
 * Rendered into the page by publications.js. Can be edited by hand or by the
 * ORCID/arXiv update bot (see .github/workflows/update-publications.yml).
 *
 * Each item: authors[], title, venue, details, year, status
 * (published | in press | preprint), url, doi, arxiv, abstract.
 *
 * Abstracts of published works are taken from the publisher page, otherwise from
 * arXiv (latest version). Math is written in LaTeX and typeset by MathJax.
 *
 * Wrapped as a JS global (instead of a plain .json) so the browser can load it
 * locally via file:// too; also exported for Node so the bot can read/write it.
 */
const PUBLICATIONS = {
  "meta": {
    "author": "Mathias Braun",
    "orcid": "0000-0002-3005-4267",
    "arxivSearch": "https://arxiv.org/a/braun_m_1",
    "mathscinetAuthorId": "1422964",
    "zbmathAuthor": "braun.mathias",
    "googleScholar": "sDOT6TMAAAAJ",
    "lastUpdated": "2026-08-04"
  },
  "categories": [
    {
      "id": "monographs",
      "title": "Monographs",
      "items": [
        {
          "id": "vector-calculus-tamed-dirichlet",
          "authors": ["Mathias Braun"],
          "title": "Vector calculus for tamed Dirichlet spaces",
          "venue": "Memoirs of the American Mathematical Society",
          "details": "303 (2024), no. 1522, 118 pp.",
          "year": 2024,
          "status": "published",
          "url": "https://www.ams.org/books/memo/1522",
          "doi": null,
          "arxiv": "2108.12374",
          "abstract": "In the language of $L^\\infty$-modules proposed by Gigli, we introduce a first order calculus on a topological Lusin measure space $(M,\\mathfrak{m})$ carrying a quasi-regular, strongly local Dirichlet form $\\mathscr{E}$. Furthermore, we develop a second order calculus if $(M,\\mathscr{E},\\mathfrak{m})$ is tamed by a signed measure in the extended Kato class in the sense of Erbar, Rigoni, Sturm and Tamanini. This allows us to define e.g. Hessians, covariant and exterior derivatives, Ricci curvature, and second fundamental form."
        },
        {
          "id": "causal-convergence-conditions",
          "authors": ["Mathias Braun", "Robert J. McCann"],
          "title": "Causal convergence conditions through variable timelike Ricci curvature bounds",
          "venue": "Memoirs of the European Mathematical Society",
          "details": "in press, 109 pp.",
          "year": 2023,
          "status": "in press",
          "url": null,
          "doi": null,
          "arxiv": "2312.17158",
          "abstract": "We describe a nonsmooth notion of globally hyperbolic, regular length metric spacetimes $(\\mathrm{M},l)$. It is based on ideas of Kunzinger-Sämann, but does not require Lipschitz continuity of causal curves. We study geodesics on $\\mathrm{M}$ and the space of probability measures over $\\mathrm{M}$ in detail. Furthermore, for such a spacetime endowed with a reference measure $\\mathfrak{m}$, a lower semicontinuous function $k\\colon \\mathrm{M} \\to \\textbf{R}$, and constants $0<p<1$ and $N\\geq 1$, we introduce and study the entropic timelike curvature dimension condition $\\smash{\\mathrm{TCD}_p^e(k,N)}$ with variable Ricci curvature bound $k$. This provides a unified synthetic approach to general relativistic energy conditions, including $\\bullet$ the Hawking-Penrose strong energy condition $\\mathrm{Ric}\\geq 0$, or more generally $\\mathrm{Ric}\\geq K$ for constant $K\\in\\textbf{R}$, in all timelike directions, $\\bullet$ the weak energy condition $\\mathrm{Ric} \\geq \\mathrm{scal} - Λ$ in all timelike directions, and $\\bullet$ the null energy condition $\\smash{\\mathrm{Ric} \\geq 0}$ in all null directions. Our approach also allows for the synthetic quantification of asymptotic conditions or integral controls on the timelike Ricci curvature. For example, we give a nonsmooth generalization of a timelike diameter estimate of Frankel-Galloway (and Schneider), and of a Hawking-type singularity theorem which requires only that the negative Ricci curvature have small enough integral relative to the maximal mean curvature of an achronal slice. As further applications, we discuss the stability of our notion and provide timelike geometric inequalities. To obtain sharp constants in the latter, we develop the localization paradigm in the variable $k$ framework."
        }
      ]
    },
    {
      "id": "publications",
      "title": "Publications",
      "items": [
        {
          "id": "elliptic-proof-splitting",
          "authors": ["Mathias Braun", "Nicola Gigli", "Robert J. McCann", "Argam Ohanyan", "Clemens Sämann"],
          "title": "An elliptic proof of the splitting theorems from Lorentzian geometry",
          "venue": "Communications of the American Mathematical Society",
          "details": "to appear, 34 pp.",
          "year": 2024,
          "status": "in press",
          "url": null,
          "doi": null,
          "arxiv": "2410.12632",
          "abstract": "We provide a new proof of the splitting theorems from Lorentzian geometry, in which simplicity is gained by sacrificing linearity of the d'Alembertian to recover ellipticity. We exploit a negative homogeneity (non-uniformly) elliptic $p$-d'Alembert operator for this purpose. This allows us to bring the Eschenburg, Galloway, and Newman Lorentzian splitting theorems into a framework closer to the Cheeger-Gromoll splitting theorem from Riemannian geometry."
        },
        {
          "id": "spacetime-reconstruction",
          "authors": ["Mathias Braun"],
          "title": "Spacetime reconstruction by order and number",
          "venue": "Classical and Quantum Gravity",
          "details": "43 (2026), no. 4, Paper No. 045015, 15 pp.",
          "year": 2026,
          "status": "published",
          "url": "https://iopscience.iop.org/article/10.1088/1361-6382/ae456c",
          "doi": "10.1088/1361-6382/ae456c",
          "arxiv": "2507.01907",
          "abstract": "We show that the random adjacency matrices induced by the chronological relations and i.i.d. samples of two spacetimes coincide in law if and only if the spacetimes in question are smoothly isometric. A similar result is proven for weighted spacetimes. In the smooth framework of our article, this relaxes the hypotheses of the recent Gromov reconstruction theorem in Lorentzian signature by Braun–Sämann from a.s. isometry of the respective time separation functions to a.s. order isometry. In a probabilistic way, our result makes a key paradigm of causal set theory rigorous: spacetime can be recovered by only knowing 'order' and 'number' of its points. It confirms a weak version of Bombelli's conjecture; therefore, it contributes to recent efforts of formalizing the Hauptvermutung (viz. fundamental conjecture) of causal set theory. Moreover, among our contributions is a new extension theorem for chronology-preserving maps between spacetimes."
        },
        {
          "id": "finsler-timelike-ricci",
          "authors": ["Mathias Braun", "Shin-ichi Ohta"],
          "title": "Optimal transport and timelike lower Ricci curvature bounds on Finsler spacetimes",
          "venue": "Transactions of the American Mathematical Society",
          "details": "377 (2024), no. 5, 3529–3576",
          "year": 2024,
          "status": "published",
          "url": "https://www.ams.org/journals/tran/2024-377-05/S0002-9947-2024-09126-2/home.html",
          "doi": "10.1090/tran/9126",
          "arxiv": "2305.04389",
          "abstract": "We prove that a Finsler spacetime endowed with a smooth reference measure whose induced weighted Ricci curvature $\\smash{\\mathrm{Ric}_N}$ is bounded from below by a real number $K$ in every timelike direction satisfies the timelike curvature-dimension condition $\\smash{\\mathrm{TCD}_q(K,N)}$ for all $q\\in (0,1)$. A nonpositive-dimensional version ($N \\le 0$) of this result is also shown. Our discussion is based on the solvability of the Monge problem with respect to the $q$-Lorentz-Wasserstein distance as well as the characterization of $q$-geodesics of probability measures. One consequence of our work is the sharp timelike Brunn-Minkowski inequality in the Lorentz-Finsler case."
        },
        {
          "id": "heat-kernel-lipschitz",
          "authors": ["Mathias Braun", "Chiara Rigoni"],
          "title": "Heat kernel bounds and Ricci curvature for Lipschitz manifolds",
          "venue": "Stochastic Processes and their Applications",
          "details": "170 (2024), Paper No. 104292, 21 pp.",
          "year": 2024,
          "status": "published",
          "url": "https://www.sciencedirect.com/science/article/pii/S0304414923002648?via%3Dihub",
          "doi": "10.1016/j.spa.2023.104292",
          "arxiv": "2111.12607",
          "abstract": "Given any $d$-dimensional Lipschitz Riemannian manifold $(M,g)$ with heat kernel $\\mathsf{p}$, we establish uniform upper bounds on $\\mathsf{p}$ which can always be decoupled in space and time. More precisely, we prove the existence of a constant $C>0$ and a bounded Lipschitz function $R\\colon M \\to (0,\\infty)$ such that for every $x\\in M$ and every $t>0$, \\begin{align*} \\sup_{y\\in M} \\mathsf{p}(t,x,y) \\leq C\\min\\{t, R^2(x)\\}^{-d/2}. \\end{align*} This allows us to identify suitable weighted Lebesgue spaces w.r.t. the given volume measure as subsets of the Kato class induced by $(M,g)$. In the case $\\partial M \\neq \\emptyset$, we also provide an analogous inclusion for Lebesgue spaces w.r.t. the surface measure on $\\partial M$. We use these insights to give sufficient conditions for a possibly noncomplete Lipschitz Riemannian manifold to be tamed, i.e. to admit a measure-valued lower bound on the Ricci curvature, formulated in a synthetic sense."
        },
        {
          "id": "timelike-ricci-low-regularity",
          "authors": ["Mathias Braun", "Matteo Calisti"],
          "title": "Timelike Ricci bounds for low regularity spacetimes by optimal transport",
          "venue": "Communications in Contemporary Mathematics",
          "details": "26 (2024), no. 9, Paper No. 2350049, 23 pp.",
          "year": 2024,
          "status": "published",
          "url": "https://www.worldscientific.com/doi/10.1142/S0219199723500499",
          "doi": "10.1142/S0219199723500499",
          "arxiv": "2209.03802",
          "abstract": "We prove that a globally hyperbolic smooth spacetime endowed with a $\\smash{\\mathrm{C}^1}$-Lorentzian metric whose Ricci tensor is bounded from below in all timelike directions, in a distributional sense, obeys the timelike measure-contraction property. This result includes a class of spacetimes with borderline regularity for which local existence results for the vacuum Einstein equation are known in the setting of spaces with timelike Ricci bounds in a synthetic sense. In particular, these spacetimes satisfy timelike Brunn-Minkowski, Bonnet-Myers, and Bishop-Gromov inequalities in sharp form, without any timelike nonbranching assumption. If the metric is even $\\smash{\\mathrm{C}^{1,1}}$, in fact the stronger timelike curvature-dimension condition holds. In this regularity, we also obtain uniqueness of chronological optimal couplings and chronological geodesics."
        },
        {
          "id": "renyi-entropy-lorentzian",
          "authors": ["Mathias Braun"],
          "title": "Rényi's entropy on Lorentzian spaces. Timelike curvature-dimension conditions",
          "venue": "Journal de Mathématiques Pures et Appliquées (9)",
          "details": "177 (2023), 46–128",
          "year": 2023,
          "status": "published",
          "url": "https://www.sciencedirect.com/science/article/pii/S0021782423000831",
          "doi": "10.1016/j.matpur.2023.06.009",
          "arxiv": "2206.13005",
          "abstract": "For a Lorentzian space measured by $\\mathfrak{m}$ in the sense of Kunzinger, Sämann, Cavalletti, and Mondino, we introduce and study synthetic notions of timelike lower Ricci curvature bounds by $K\\in\\boldsymbol{\\mathrm{R}}$ and upper dimension bounds by $N\\in[1,\\infty)$, namely the timelike curvature-dimension conditions $\\smash{\\mathrm{TCD}_p(K,N)}$ and $\\smash{\\mathrm{TCD}_p^*(K,N)}$ in weak and strong forms, where $p\\in (0,1)$, and the timelike measure-contraction properties $\\smash{\\mathrm{TMCP}(K,N)}$ and $\\smash{\\mathrm{TMCP}^*(K,N)}$. These are formulated by convexity properties of the Rényi entropy with respect to $\\mathfrak{m}$ along $\\smash{\\ell_p}$-geodesics of probability measures. We show many features of these notions, including their compatibility with the smooth setting, sharp geometric inequalities, stability, equivalence of the named weak and strong versions, local-to-global properties, and uniqueness of chronological $\\smash{\\ell_p}$-optimal couplings and chronological $\\smash{\\ell_p}$-geodesics. We also prove the equivalence of $\\smash{\\mathrm{TCD}_p^*(K,N)}$ and $\\smash{\\mathrm{TMCP}^*(K,N)}$ to their respective entropic counterparts in the sense of Cavalletti and Mondino. Some of these results are obtained under timelike $p$-essential nonbranching, a concept which is a priori weaker than timelike nonbranching."
        },
        {
          "id": "good-geodesics-tcd",
          "authors": ["Mathias Braun"],
          "title": "Good geodesics satisfying the timelike curvature-dimension condition",
          "venue": "Nonlinear Analysis",
          "details": "229 (2023), Paper No. 113205, 30 pp.",
          "year": 2023,
          "status": "published",
          "url": "https://www.sciencedirect.com/science/article/pii/S0362546X22002802?dgcid=author",
          "doi": "10.1016/j.na.2022.113205",
          "arxiv": "2205.06950",
          "abstract": "Let $(M,\\mathsf{d},\\mathfrak{m},\\ll,\\leq,τ)$ be a causally closed, $\\mathscr{K}$-globally hyperbolic, regular measured Lorentzian geodesic space satisfying the weak timelike curvature-dimension condition $\\smash{\\mathrm{wTCD}_p^e(K,N)}$ in the sense of Cavalletti and Mondino. We prove the existence of geodesics of probability measures on $M$ which satisfy the entropic semiconvexity inequality defining $\\smash{\\mathrm{wTCD}_p^e(K,N)}$ and whose densities with respect to $\\mathfrak{m}$ are additionally uniformly $L^\\infty$ in time. This holds apart from any nonbranching assumption. We also discuss similar results under the timelike measure-contraction property."
        },
        {
          "id": "heat-flow-1-forms",
          "authors": ["Mathias Braun"],
          "title": "Heat flow on 1-forms under lower Ricci bounds. Functional inequalities, spectral theory, and heat kernel",
          "venue": "Journal of Functional Analysis",
          "details": "283 (2022), no. 7, Paper No. 109599, 65 pp.",
          "year": 2022,
          "status": "published",
          "url": "https://www.sciencedirect.com/science/article/pii/S0022123622002191?dgcid=author",
          "doi": "10.1016/j.jfa.2022.109599",
          "arxiv": "2010.01849",
          "abstract": "We study the canonical heat flow $(\\mathsf{H}_t)_{t\\geq 0}$ on the cotangent module $L^2(T^*M)$ over an $\\mathrm{RCD}(K,\\infty)$ space $(M,\\mathsf{d},\\mathfrak{m})$, $K\\in\\boldsymbol{\\mathrm{R}}$. We show Hess-Schrader-Uhlenbrock's inequality and, if $(M,\\mathsf{d},\\mathfrak{m})$ is also an $\\mathrm{RCD}^*(K,N)$ space, $N\\in(1,\\infty)$, Bakry-Ledoux's inequality for $(\\mathsf{H}_t)_{t\\geq 0}$ w.r.t. the heat flow $(\\mathsf{P}_t)_{t\\geq 0}$ on $L^2(M)$. Variable versions of these estimates are discussed as well. In conjunction with a study of logarithmic Sobolev inequalities for $1$-forms, the previous inequalities yield various $L^p$-properties of $(\\mathsf{H}_t)_{t\\geq 0}$, $p\\in [1,\\infty]$. Then we establish explicit inclusions between the spectrum of its generator, the Hodge Laplacian $\\smash{\\vecΔ}$, of the negative functional Laplacian $-Δ$, and of the Schrödinger operator $-Δ+K$. In the $\\mathrm{RCD}^*(K,N)$ case, we prove compactness of $\\smash{\\vecΔ^{-1}}$ if $M$ is compact, and the independence of the $L^p$-spectrum of $\\smash{\\vecΔ}$ on $p \\in [1,\\infty]$ under a volume growth condition. We terminate by giving an appropriate interpretation of a heat kernel for $(\\mathsf{H}_t)_{t\\geq 0}$. We show its existence in full generality without any local compactness or doubling, and derive fundamental estimates and properties of it."
        },
        {
          "id": "heat-flow-regularity-bel",
          "authors": ["Mathias Braun", "Batu Güneysu"],
          "title": "Heat flow regularity, Bismut–Elworthy–Li's derivative formula, and pathwise couplings on Riemannian manifolds with Kato bounded Ricci curvature",
          "venue": "Electronic Journal of Probability",
          "details": "26 (2021), Paper No. 129, 1–25",
          "year": 2021,
          "status": "published",
          "url": "https://projecteuclid.org/journals/electronic-journal-of-probability/volume-26/issue-none/Heat-flow-regularity-BismutElworthyLis-derivative-formula-and-pathwise-couplings-on/10.1214/21-EJP703.full",
          "doi": "10.1214/21-EJP703",
          "arxiv": "2001.10297",
          "abstract": "We prove that if the Ricci tensor $\\mathrm{Ric}$ of a geodesically complete Riemannian manifold $M$, endowed with the Riemannian distance $\\mathsf{d}$ and the Riemannian measure $\\mathfrak{m}$, is bounded from below by a continuous function $k\\colon M\\to\\mathbb{R}$ whose negative part $k^-$ satisfies, for every $t>0$, the exponential integrability condition \\begin{equation*} \\sup_{x\\in M} \\mathbb{E}\\big[\\mathrm{e}^{\\int_0^t k^-(\\mathsf{b}_r^x)/2\\,\\mathrm{d} r}\\,1_{\\{t < ζ^x\\}}\\big] < \\infty, \\end{equation*} then the lifetime $ζ^x$ of Brownian motion $\\mathsf{b}^x$ on $M$ starting in any $x\\in M$ is a.s. infinite. This assumption on $k$ holds if $k^-$ belongs to the Kato class of $M$. We also derive a Bismut-Elworthy-Li derivative formula for $\\nabla \\mathsf{P}_tf$ for every $f\\in L^\\infty(M)$ and $t>0$ along the heat flow $(\\mathsf{P}_t)_{t\\geq 0}$ with generator $Δ/2$, yielding its $L^\\infty$-$\\mathrm{Lip}$-regularization as a corollary. Moreover, given the stochastic completeness of $M$, but without any assumption on $k$ except continuity, we prove the equivalence of lower boundedness of $\\mathrm{Ric}$ by $k$ to the existence, given any $x,y\\in M$, of a coupling $(\\mathsf{b}^x,\\mathsf{b}^y)$ of Brownian motions on $M$ starting in $(x,y)$ such that a.s., \\begin{equation*} \\mathsf{d}\\big(\\mathsf{b}_t^x,\\mathsf{b}_t^y\\big) \\leq \\mathrm{e}^{-\\int_s^t \\underline{k}(\\mathsf{b}_r^x,\\mathsf{b}_r^y)/2\\,\\mathrm{d} r}\\,\\mathsf{d}\\big(\\mathsf{b}_s^x,\\mathsf{b}_s^y\\big) \\end{equation*} holds for every $s,t\\geq 0$ with $s\\leq t$, involving the \"average\" $\\underline{k}(u,v) := \\inf_γ\\int_0^1 k(γ_r)\\,\\mathrm{d} r$ of $k$ along geodesics from $u$ to $v$. Our results generalize to weighted Riemannian manifolds, where the Ricci curvature is replaced by the corresponding Bakry-Émery Ricci tensor."
        },
        {
          "id": "ot-gradient-estimates-brownian",
          "authors": ["Mathias Braun", "Karen Habermann", "Karl-Theodor Sturm"],
          "title": "Optimal transport, gradient estimates, and pathwise Brownian coupling on spaces with variable Ricci bounds",
          "venue": "Journal de Mathématiques Pures et Appliquées",
          "details": "147 (2021), 60–97",
          "year": 2021,
          "status": "published",
          "url": "https://www.sciencedirect.com/science/article/pii/S0021782421000118",
          "doi": "10.1016/j.matpur.2021.01.002",
          "arxiv": "1906.09186",
          "abstract": "Given a metric measure space $(X,\\mathsf{d},\\mathfrak{m})$ and a lower semicontinuous, lower bounded function $k\\colon X\\to\\mathbb{R}$, we prove the equivalence of the synthetic approaches to Ricci curvature at $x\\in X$ being bounded from below by $k(x)$ in terms of $\\bullet$ the Bakry-Émery estimate $ΔΓ(f)/2 - Γ(f,Δf) \\geq k\\,Γ(f)$ in an appropriate weak formulation, and $\\bullet$ the curvature-dimension condition $\\mathrm{CD}(k,\\infty)$ in the sense Lott-Sturm-Villani with variable $k$. Moreover, for all $p\\in(1,\\infty)$, these properties hold if and only if the perturbed $p$-transport cost \\begin{equation*} W_p^{\\underline{k}}(μ_1,μ_2,t):=\\inf_{(\\mathsf{b}^1,\\mathsf{b}^2)} \\mathbb{E}\\Big[\\mathrm{e}^{\\int_0^{2t} p \\underline{k}\\left(\\mathsf{b}^1_{r}, \\mathsf{b}^2_{r}\\right)/2\\,\\mathrm{d} r} \\mathsf{d}^p\\!\\left(\\mathsf{b}^1_{2t},\\mathsf{b}^2_{2t} \\right)\\!\\Big]^{1/p} \\end{equation*} is nonincreasing in $t$. The infimum here is taken over pairs of coupled Brownian motions $\\mathsf{b}^1$ and $\\mathsf{b}^2$ on $X$ with given initial distributions $μ_1$ and $μ_2$, respectively, and $\\underline{k}(x,y) := \\inf_γ\\int_0^1 k(γ_s)\\,\\mathrm{d} s$ denotes the \"average\" of $k$ along geodesics $γ$ connecting $x$ and $y$. Furthermore, for any pair of initial distributions $μ_1$ and $μ_2$ on $X$, we prove the existence of a pair of coupled Brownian motions $\\mathsf{b}^1$ and $\\mathsf{b}^2$ such that a.s. for every $s,t\\in[0,\\infty)$ with $s\\leq t$, we have \\begin{equation*} \\mathsf{d}\\!\\left(\\mathsf{b}_t^1,\\mathsf{b}_t^2\\right)\\leq \\mathrm{e}^{-\\int_s^t \\underline{k}\\left(\\mathsf{b}_r^1,\\mathsf{b}_r^2\\right)/2\\,\\mathrm{d} r} \\mathsf{d}\\!\\left(\\mathsf{b}_s^1,\\mathsf{b}_s^2\\right)\\!. \\end{equation*}"
        }
      ]
    },
    {
      "id": "prepublications",
      "title": "Preprints",
      "items": [
        {
          "id": "comparison-theory-lipschitz-spacetimes",
          "authors": ["Mathias Braun", "Marta Sálamo Candal"],
          "title": "Comparison theory for Lipschitz spacetimes",
          "venue": "arXiv preprint",
          "details": "arXiv:2603.24195, 52 pp.",
          "year": 2026,
          "status": "preprint",
          "url": null,
          "doi": null,
          "arxiv": "2603.24195",
          "abstract": "We prove a globally hyperbolic spacetime with locally Lipschitz continuous metric and timelike distributional Ricci curvature bounded from below obeys the timelike measure contraction property. The remarkable class of examples of spacetimes that are covered by this result includes impulsive gravity waves, thin shells, and matched spacetimes. As applications, we get new comparison theorems for Lipschitz spacetimes in sharp form: d'Alembert, timelike Brunn-Minkowski, and timelike Bishop-Gromov. Under appropriate nonbranching assumptions (conjectured to hold in even lower regularity), our results also yield the timelike curvature-dimension condition, a volume incompleteness theorem, as well as exact representation formulas and sharp comparison estimates for d'Alembertians of Lorentz distance functions from general spacelike submanifolds. Moreover, we establish the sharp timelike Bonnet–Myers inequality ad hoc using the localization technique from convex geometry. Alongside, we prove a timelike diameter estimate for spacetimes whose timelike Ricci curvature is positive up to a \"small\" deviation (in an $L^p$-sense). This adapts prior theorems for Riemannian manifolds by Petersen-Sprouse and Aubry to Lorentzian geometry, a transition the former two anticipated almost 30 years ago."
        },
        {
          "id": "synthetic-gannon-lee",
          "authors": ["Mathias Braun", "Carlo Rotolo"],
          "title": "A synthetic Gannon–Lee incompleteness theorem",
          "venue": "arXiv preprint",
          "details": "arXiv:2602.14246, 20 pp.",
          "year": 2026,
          "status": "preprint",
          "url": null,
          "doi": null,
          "arxiv": "2602.14246",
          "abstract": "We prove the Gannon-Lee incompleteness theorem for globally hyperbolic spacetimes. We assume the synthetic null energy condition of Ketterer and a trappedness condition we call \"synthetically asymptotically regular\". Our result generalizes this classical result to the weighted case. It also motivates and indicates extensions to low regularity, which are deferred to future work."
        },
        {
          "id": "lorentzian-splitting-c1",
          "authors": ["Mathias Braun", "Nicola Gigli", "Robert J. McCann", "Argam Ohanyan", "Clemens Sämann"],
          "title": "A Lorentzian splitting theorem for continuously differentiable metrics and weights",
          "venue": "arXiv preprint",
          "details": "arXiv:2507.06836, 44 pp.",
          "year": 2025,
          "status": "preprint",
          "url": null,
          "doi": null,
          "arxiv": "2507.06836",
          "abstract": "We prove a splitting theorem for globally hyperbolic, weighted spacetimes with metrics and weights of regularity $C^1$ by combining elliptic techniques for the negative homogeneity $p$-d'Alembert operator from our recent work in the smooth setting with the concept of line-adapted curves introduced here. Our results extend the Lorentzian splitting theorem proved for smooth globally hyperbolic spacetimes by Galloway – and variants of its weighted counterparts by Case and Woolgar–Wylie – to this low regularity setting."
        },
        {
          "id": "gromov-reconstruction-lorentzian",
          "authors": ["Mathias Braun", "Clemens Sämann"],
          "title": "Gromov's reconstruction theorem and measured Gromov–Hausdorff convergence in Lorentzian geometry",
          "venue": "arXiv preprint",
          "details": "arXiv:2506.10852, 35 pp.",
          "year": 2025,
          "status": "preprint",
          "url": null,
          "doi": null,
          "arxiv": "2506.10852",
          "abstract": "We establish Gromov's celebrated reconstruction theorem in Lorentzian geometry. Alongside this result, we introduce and study a natural concept of isomorphy of normalized bounded Lorentzian metric measure spaces. We outline applications to the spacetime reconstruction problem from causal set theory. Lastly, we propose three notions of convergence of (isomorphism classes of) normalized bounded Lorentzian metric measure spaces, for which we prove several fundamental properties."
        },
        {
          "id": "exact-dalembertian-lorentz-distance",
          "authors": ["Mathias Braun"],
          "title": "Exact d'Alembertian for Lorentz distance functions",
          "venue": "arXiv preprint",
          "details": "arXiv:2408.16525, 84 pp.",
          "year": 2024,
          "status": "preprint",
          "url": null,
          "doi": null,
          "arxiv": "2408.16525",
          "abstract": "We refine a recent distributional notion of d'Alembertian of a signed Lorentz distance function to an achronal set in a metric measure spacetime obeying the timelike measure contraction property. We show precise representation formulas and comparison estimates (both upper and lower bounds). Under a condition we call \"infinitesimally strict concavity\" (known for infinitesimally Minkowskian structures and established here for Finsler spacetimes), we prove the associated distribution is a signed measure certifying the integration by parts formula. This treatment of the d'Alembertian using techniques from metric geometry expands upon its recent nonlinear yet elliptic interpretation; even in the smooth case, our formulas seem to pioneer its exact shape across the timelike cut locus. Two central ingredients our contribution unifies are the localization paradigm of Cavalletti-Mondino and the Sobolev calculus of Beran-Braun-Calisti-Gigli-McCann-Ohanyan-Rott-Sämann. In the second part of our work, we present several applications of these insights. First, we show the equivalence of the timelike curvature-dimension condition with a Bochner-type inequality. Second, we set up synthetic mean curvature (as well as barriers for CMC sets) exactly. Third, we prove synthetic volume and area estimates of Heintze-Karcher-type, which enable us to show several synthetic volume singularity theorems."
        },
        {
          "id": "nonlinear-dalembert-comparison",
          "authors": ["Tobias Beran", "Mathias Braun", "Matteo Calisti", "Nicola Gigli", "Robert J. McCann", "Argam Ohanyan", "Felix Rott", "Clemens Sämann"],
          "title": "A nonlinear d'Alembert comparison theorem and causal differential calculus on metric measure spacetimes",
          "venue": "arXiv preprint",
          "details": "arXiv:2408.15968, 112 pp.",
          "year": 2024,
          "status": "preprint",
          "url": null,
          "doi": null,
          "arxiv": "2408.15968",
          "abstract": "We introduce a variational first-order Sobolev calculus on metric measure spacetimes. The key object is the maximal weak subslope of an arbitrary causal function, which plays the role of the (Lorentzian) modulus of its differential. It is shown to satisfy certain chain and Leibniz rules, certify a locality property, and be compatible with its smooth analog. In this setup, we propose a quadraticity condition termed infinitesimal Minkowskianity, which singles out genuinely Lorentzian structures among Lorentz-Finsler spacetimes. Moreover, we establish a comparison theorem for a nonlinear yet elliptic $p$-d'Alembertian in a weak form under the timelike measure contraction property. As a particular case, this extends Eschenburg's classical estimate past the timelike cut locus."
        }
      ]
    },
    {
      "id": "proceedings",
      "title": "Proceedings",
      "items": [
        {
          "id": "new-perspectives-dalembertian-invitation",
          "authors": ["Mathias Braun"],
          "title": "New perspectives on the d'Alembertian from general relativity. An invitation",
          "venue": "Indagationes Mathematicae",
          "details": "in press, 49 pp.",
          "year": 2025,
          "status": "in press",
          "url": "https://www.sciencedirect.com/science/article/pii/S001935772500045X",
          "doi": "10.1016/j.indag.2025.05.002",
          "arxiv": "2501.19071",
          "abstract": "This survey has multiple objectives. First, we motivate and review a new distributional notion of the d'Alembertian from mathematical relativity, more precisely, a nonlinear $p$-version thereof, where $p$ is a nonzero number less than one. This operator comes from natural Lagrangian actions introduced relatively recently. Unlike its classical linear yet hyperbolic counterpart, it is nonlinear yet has elliptic characteristics. Second, we describe recent comparison estimates for the $p$-d'Alembertian of Lorentz distance functions (notably a point or a spacelike hypersurface). Their new contribution implied by prior works on optimal transport through spacetime is a control of the timelike cut locus. Third, we illustrate exact representation formulas for these $p$-d'Alembertians employing methods from convex geometry. Fourth, several applications and open problems are presented."
        },
        {
          "id": "vector-calculus-oberwolfach",
          "authors": ["Mathias Braun"],
          "title": "Vector calculus for tamed Dirichlet spaces",
          "venue": "Oberwolfach Reports",
          "details": "58 (2021), 27–30",
          "year": 2021,
          "status": "published",
          "url": "https://publications.mfo.de/bitstream/handle/mfo/3926/OWR_2021_58.pdf?sequence=4&isAllowed=y",
          "doi": "10.14760/OWR-2021-58",
          "arxiv": null
        }
      ]
    }
  ]
};

if (typeof window !== 'undefined') window.PUBLICATIONS = PUBLICATIONS;
if (typeof module !== 'undefined' && module.exports) module.exports = PUBLICATIONS;
