import { useEffect, useState } from "react";

const REPO = "https://github.com/Arwin-K/CUDA-Attention-Softmax";
const RUN = `${REPO}/tree/main/results/runs/2026-08-23_tesla-t4_ca87722`;
type ResearchTheme = "light" | "dark";

const softmaxRows = [
  ["128", "38.752", "77.600", "225.664", "2.00×"],
  ["255", "58.544", "81.920", "143.456", "1.40×"],
  ["512", "131.040", "337.920", "197.392", "2.58×"],
  ["768", "239.440", "735.264", "344.352", "3.07×"],
  ["1,024", "359.568", "1,278.592", "465.424", "3.56×"],
  ["1,536", "723.952", "2,855.840", "1,182.416", "3.94×"],
  ["2,048", "1,414.480", "5,125.488", "1,385.760", "3.62×"],
];

const attentionRows = [
  ["128", "129.008", "198.544", "84.000", "1.54×"],
  ["255", "204.288", "352.128", "163.600", "1.72×"],
  ["512", "323.584", "747.888", "245.808", "2.31×"],
  ["768", "587.312", "1,071.088", "384.864", "1.82×"],
  ["1,024", "1,014.016", "1,820.672", "543.744", "1.80×"],
  ["1,536", "2,438.960", "4,115.824", "1,032.400", "1.69×"],
  ["2,048", "4,198.768", "7,090.240", "1,660.576", "1.69×"],
];

function Figure({
  number,
  src,
  alt,
  children,
  panoramic = false,
}: {
  number: number;
  src: string;
  alt: string;
  children: React.ReactNode;
  panoramic?: boolean;
}) {
  return (
    <figure className={`research-figure${panoramic ? " research-figure--panoramic" : ""}`}>
      <a className="research-figure__media" href={src} target="_blank" rel="noreferrer" aria-label={`Open Figure ${number} at full size`}>
        <img src={src} alt={alt} loading="lazy" />
      </a>
      <figcaption><strong>Figure {number}.</strong> {children}</figcaption>
    </figure>
  );
}

function ResultsTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="research-table-scroll">
      <table className="research-table">
        <caption>{caption}</caption>
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CudaResearchPage() {
  const [theme, setTheme] = useState<ResearchTheme>(() => {
    const savedTheme = localStorage.getItem("cuda-research-theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("cuda-research-theme", theme);
  }, [theme]);

  return (
    <div className="research-page" data-research-theme={theme}>
      <header className="research-site-header">
        <a href="/" className="research-wordmark">Arwin Karir</a>
        <nav aria-label="Article links">
          <a href={`${REPO}/blob/main/docs/paper.md`} target="_blank" rel="noreferrer">Paper</a>
          <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
          <button
            className="research-theme-toggle"
            type="button"
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </nav>
      </header>

      <main>
        <header className="research-hero">
          <p className="research-kicker">GPU systems · Research note</p>
          <h1>Optimizing Fused Causal Softmax in CUDA</h1>
          <p className="research-subtitle">An empirical study of work decomposition, warp-level reductions, launch configuration, and end-to-end transformer attention performance.</p>
          <div className="research-byline">
            <span>By <strong>Arwin Karir</strong></span>
            <span>September 2026</span>
            <span>NVIDIA Tesla T4</span>
          </div>
        </header>

        <div className="research-layout">
          <aside className="research-toc" aria-label="Table of contents">
            <p>Contents</p>
            <a href="#abstract">Abstract</a>
            <a href="#problem">The problem</a>
            <a href="#method">Method</a>
            <a href="#evolution">Kernel evolution</a>
            <a href="#results">Results</a>
            <a href="#attention">Complete attention</a>
            <a href="#profiling">Profiling</a>
            <a href="#limitations">Limitations</a>
            <a href="#reproduction">Reproduction</a>
          </aside>

          <article className="research-article">
            <section id="abstract" className="research-abstract">
              <h2>Abstract</h2>
              <p>
                This study examines the design of a fused FP32 causal scaled-softmax operator for transformer attention. The implementation combines scaling, causal masking, numerically stable maximum subtraction, exponentiation, reduction, and normalization in one CUDA kernel. Three historical implementations—row serial, block-level shared-tree reduction, and warp-level reduction—are retained in Git so that performance can be attributed to specific engineering decisions.
              </p>
              <p>
                In one controlled Tesla T4 session, the final warp-reduction kernel was 3.22–8.92× faster than the serial baseline and 1.07–1.91× faster than the shared-tree version. It outperformed equivalent PyTorch eager softmax by 1.40–3.94×. Substituting the kernel into explicit attention yielded smaller end-to-end gains of 1.54–2.31×; production PyTorch SDPA remained faster at every measured shape.
              </p>
            </section>

            <section className="research-summary" aria-labelledby="summary-title">
              <h2 id="summary-title">In brief</h2>
              <ul>
                <li><strong>Correctness held:</strong> 88 of 88 structured cases passed, with maximum absolute error of 3.5763 × 10<sup>−7</sup>.</li>
                <li><strong>Parallel decomposition mattered most:</strong> the final kernel achieved a 6.34× geometric-mean speedup over row serial.</li>
                <li><strong>Kernel speed is not application speed:</strong> the geometric-mean gain over eager softmax was 2.73×, but explicit attention improved by only 1.54–2.31×.</li>
                <li><strong>The production baseline still won:</strong> SDPA was faster at all seven attention shapes, reinforcing the value of fusion across a wider operator boundary.</li>
              </ul>
            </section>

            <section id="problem">
              <p className="research-section-label">01</p>
              <h2>The problem: a small operator with a large synchronization burden</h2>
              <p>
                Causal softmax converts each attention-score row into a probability distribution while ensuring that token <em>i</em> cannot attend to any future token <em>j &gt; i</em>. For each row, the kernel must identify the largest valid value, subtract it for numerical stability, exponentiate the shifted values, accumulate their sum, and normalize the result. Each reduction introduces communication; each intermediate tensor risks another trip through global memory.
              </p>
              <div className="research-equation" role="img" aria-label="Stable causal softmax equation">
                <span>p<sub>ij</sub> =</span>
                <span className="research-fraction"><span>exp(x<sub>ij</sub> − m<sub>i</sub>)</span><span>Σ<sub>k≤i</sub> exp(x<sub>ik</sub> − m<sub>i</sub>)</span></span>
                <span>, &nbsp;j ≤ i</span>
              </div>
              <p>
                The implementation assigns one CUDA block to each row of a flattened <code>[rows, S]</code> score matrix. The query position is recovered as <code>row % S</code>. Values beyond that position are excluded from both reductions and written as exactly zero. The central question is not merely whether this can be fused, but how work and communication should be arranged inside the block.
              </p>
              <blockquote>
                How do cooperative work decomposition, parallel reductions, warp communication, and launch configuration affect fused causal-softmax performance—and how much of that improvement remains once the kernel is placed back inside attention?
              </blockquote>
            </section>

            <section id="method">
              <p className="research-section-label">02</p>
              <h2>Experimental method</h2>
              <p>
                Correctness was established before timing. Independent PyTorch compositions served as the trusted reference for causal softmax and complete attention. The test suite checked output values, row sums, masked zeros, shape, dtype, device placement, NaN and infinity behavior, and rejection of unsupported inputs.
              </p>
              <p>
                Device latency was measured with CUDA events. Every implementation and shape received 25 warm-up iterations followed by 100 measured iterations; input preparation and allocation were kept outside the timed region. Reported values are medians. The 100 observations describe within-session variation and are not treated as independent hardware replications.
              </p>
              <dl className="research-specs">
                <div><dt>GPU</dt><dd>NVIDIA Tesla T4, compute capability 7.5, 15.6 GB</dd></div>
                <div><dt>Software</dt><dd>CUDA 12.8, PyTorch 2.11.0+cu128, Python 3.13.15</dd></div>
                <div><dt>Softmax workload</dt><dd>Contiguous FP32; rows = 8S</dd></div>
                <div><dt>Attention workload</dt><dd>Batch 1, eight heads, head dimension 64</dd></div>
                <div><dt>Sequence lengths</dt><dd>128, 255, 512, 768, 1,024, 1,536, 2,048</dd></div>
                <div><dt>Measured revision</dt><dd><code>ca87722a</code>, clean worktree</dd></div>
              </dl>
            </section>

            <section id="evolution">
              <p className="research-section-label">03</p>
              <h2>Kernel evolution as an ablation study</h2>
              <p>
                The repository history provides the ablation sequence. Rather than comparing unrelated kernels, each stage changes the mechanism responsible for work distribution or reduction while retaining the same operator contract.
              </p>
              <ol className="research-stages">
                <li><strong>Row serial <code>8f07d762</code>.</strong> One thread owns one row and performs every maximum, sum, and normalization scan sequentially. This is the simplest correct mapping and the performance baseline.</li>
                <li><strong>Shared-memory tree <code>f9420de0</code>.</strong> One block owns a row. Threads traverse columns cooperatively, place partial results in shared memory, and combine them through a block-wide tree reduction.</li>
                <li><strong>Warp reduction <code>a3736910</code>.</strong> Warp shuffles exchange values through registers. Only one partial per warp enters shared memory, and the first warp completes the block-wide reduction.</li>
                <li><strong>Launch tuning <code>ca87722a</code>.</strong> The final source supports 128, 256, and 512 threads per block, allowing a controlled sweep rather than assuming one launch configuration fits every sequence length.</li>
              </ol>
              <Figure number={1} src="/projects/cuda-softmax/fig_historical_speedup.png" alt="Speedup of shared-tree and warp-reduction CUDA kernels over the row-serial baseline across sequence lengths">
                Historical kernel speedup relative to the row-serial implementation. Cooperative block-level work accounts for the largest improvement; warp-level communication provides a smaller, consistently positive second step.
              </Figure>
            </section>

            <section id="results">
              <p className="research-section-label">04</p>
              <h2>Results: correctness first, performance second</h2>
              <p>
                All 88 structured softmax cases passed. The maximum absolute error against the independent PyTorch construction was 3.5763 × 10<sup>−7</sup>; masked probabilities were exactly zero, and no unexpected NaNs or infinities occurred. All 70 CUDA device tests also passed. At the attention level, all seven shapes passed with maximum absolute error of 2.9802 × 10<sup>−7</sup>.
              </p>
              <p className="research-callout">
                <span>Primary result</span>
                The warp-reduction kernel achieved a <strong>6.34× geometric-mean speedup</strong> over row serial, <strong>1.32×</strong> over the shared-tree kernel, and <strong>2.73×</strong> over PyTorch eager softmax.
              </p>
              <ResultsTable
                caption="Table 1. Median isolated-softmax latency from the preserved Tesla T4 run. Lower is better."
                headers={["S", "Custom (µs)", "Eager (µs)", "torch.compile (µs)", "vs. eager"]}
                rows={softmaxRows}
              />
              <Figure number={2} src="/projects/cuda-softmax/fig_softmax_latency.png" alt="Latency of custom CUDA, PyTorch eager, and compiled softmax implementations">
                Median framework-level softmax latency. The custom operator outperformed eager PyTorch at every measured sequence length. Steady-state <code>torch.compile</code> was competitive, but its relative position changed with shape.
              </Figure>
              <Figure number={3} src="/projects/cuda-softmax/fig_softmax_throughput.png" alt="Softmax throughput across tested sequence lengths">
                Effective element throughput for the same framework comparison. Throughput makes the scaling behavior visible without changing the underlying timing evidence.
              </Figure>
              <p>
                Launch configuration was shape-dependent. A 128-thread block won at five of seven sequence lengths, while 256 threads won at 1,536 and 2,048. The 512-thread configuration did not win any measured shape. The result argues for modest dispatch based on sequence length rather than a universally larger block.
              </p>
              <Figure number={4} src="/projects/cuda-softmax/fig_launch_configuration.png" alt="CUDA launch configuration sweep comparing 128, 256, and 512 threads per block">
                Launch-configuration sweep for the final kernel. More threads did not automatically produce lower latency; the balance changed only at the two longest rows.
              </Figure>
            </section>

            <section id="attention">
              <p className="research-section-label">05</p>
              <h2>What the faster kernel buys inside attention</h2>
              <p>
                Isolated kernel results can overstate application impact. Explicit attention still performs the score matrix multiplication before softmax and the value matrix multiplication after it. Those operations are unaffected by this kernel, so Amdahl’s law places a direct limit on end-to-end improvement.
              </p>
              <ResultsTable
                caption="Table 2. Median complete-attention latency. The speedup column compares custom explicit attention with eager explicit attention."
                headers={["S", "Custom (µs)", "Eager (µs)", "SDPA (µs)", "vs. eager"]}
                rows={attentionRows}
              />
              <Figure number={5} src="/projects/cuda-softmax/fig_kernel_vs_attention_speedup.png" alt="Comparison of isolated softmax speedup with complete attention speedup">
                Isolated softmax speedup versus complete explicit-attention speedup. The gap quantifies how surrounding matrix multiplications dilute the kernel-level gain.
              </Figure>
              <p>
                The custom explicit path improved on eager explicit attention by 1.54–2.31×. That is meaningful, but it is not the strongest available production result: PyTorch SDPA was 1.25–2.53× faster than the custom explicit path across the tested shapes. SDPA can optimize and fuse across a broader attention boundary, avoiding costs that a standalone softmax kernel cannot remove.
              </p>
            </section>

            <section id="profiling">
              <p className="research-section-label">06</p>
              <h2>Profiler evidence</h2>
              <p>
                Nsight measurements at sequence length 512 reported 128 threads per block, 24 registers per thread, and 16 bytes of dynamic shared memory. Kernel duration was approximately 106.976–107.584 µs. Reported utilization reached 48.33–48.79% of peak DRAM throughput and 56.72–57.00% of peak SM throughput, suggesting neither a purely bandwidth-bound nor purely compute-bound explanation is sufficient on its own.
              </p>
              <Figure number={6} src="/projects/cuda-softmax/fig_profiler_breakdown.png" alt="PyTorch profiler device-time breakdown at sequence length 512" panoramic>
                Stored PyTorch Profiler device-time breakdown at sequence length 512. The original artifact is panoramic; scroll horizontally or open it at full size to inspect the complete labeling.
              </Figure>
            </section>

            <section id="limitations">
              <p className="research-section-label">07</p>
              <h2>Limitations and threats to validity</h2>
              <p>
                The claims are deliberately narrower than the implementation’s best numbers. Every quantitative result above comes from one Tesla T4 in one managed Google Colab session. Repeated CUDA-event samples measure variability within that session; they do not establish cross-machine or cross-architecture generality.
              </p>
              <ul>
                <li>The operator is forward-only, contiguous FP32, and specific to causal masking.</li>
                <li>Backward propagation, dropout, arbitrary masks, FP16, and BF16 are outside the measured scope.</li>
                <li>Framework timings isolate device work and should not be read as end-user request latency.</li>
                <li>The historical comparison is an engineering ablation, not a comparison against every possible CUDA implementation.</li>
                <li>SDPA’s consistent advantage is part of the conclusion, not an exception to it.</li>
              </ul>
            </section>

            <section id="reproduction">
              <p className="research-section-label">08</p>
              <h2>Reproduction and source material</h2>
              <p>
                The repository preserves the source revision, environment metadata, raw samples, generated tables, profiler traces, figures, and executed notebook for the reported run. This makes the evidence chain inspectable from claim back to measurement.
              </p>
              <ul className="research-links">
                <li><a href={`${REPO}/blob/main/docs/paper.md`} target="_blank" rel="noreferrer">Full technical paper</a><span>Research questions, methods, results, validity, and future work</span></li>
                <li><a href={`${REPO}/blob/main/docs/methodology.md`} target="_blank" rel="noreferrer">Methodology</a><span>Operator contract, timing boundaries, and acceptance criteria</span></li>
                <li><a href={`${REPO}/blob/main/docs/results.md`} target="_blank" rel="noreferrer">Measured results</a><span>Correctness, ablations, comparisons, and profiler evidence</span></li>
                <li><a href={`${REPO}/blob/main/docs/reproducibility.md`} target="_blank" rel="noreferrer">Reproduction guide</a><span>Build, execution, packaging, and audit workflow</span></li>
                <li><a href={RUN} target="_blank" rel="noreferrer">Preserved Tesla T4 run</a><span>Raw CSVs, metadata, figures, tables, traces, and notebook</span></li>
                <li><a href={REPO} target="_blank" rel="noreferrer">Source repository</a><span>CUDA extension, benchmarks, tests, documentation, and history</span></li>
              </ul>
            </section>

            <section className="research-conclusion">
              <h2>Conclusion</h2>
              <p>
                The experiment’s clearest result is that work decomposition dominates. Moving from one thread per row to cooperative block-level work produced the large step change; replacing shared-memory trees with warp-level communication provided a smaller second gain. But the attention results are equally important: even a substantially faster softmax remains only one part of a larger computation. The most useful optimization target is therefore not always the slowest isolated kernel, but the widest boundary that can be safely fused and measured.
              </p>
            </section>
          </article>
        </div>
      </main>

      <footer className="research-footer">
        <span>© 2026 Arwin Karir</span>
        <a href="/">Return to arwink.me</a>
      </footer>
    </div>
  );
}
