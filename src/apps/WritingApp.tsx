const articles = [
  {
    title: "Optimizing Fused Causal Softmax in CUDA",
    description:
      "A reproducible study of work decomposition, warp-level reductions, launch configuration, profiler evidence, and end-to-end transformer attention performance.",
    date: "September 2026",
    category: "GPU systems",
    topics: ["CUDA", "PyTorch", "Transformer attention"],
    href: "/cuda-optimization-softmax",
  },
];

export function WritingApp() {
  return (
    <div className="app folder projects writing-app">
      <header className="projects__intro writing-app__header">
        <div>
          <h2>Writing</h2>
          <p>Long-form technical work, grounded in source code and measured evidence.</p>
        </div>
      </header>

      <section aria-label="Published writing">
        <h3 className="folder__section">Published writing</h3>
        <div className="repolist">
          {articles.map((article) => (
            <article className="repocard projectcard writing-card" key={article.href}>
              <div className="repocard__top">
                <a className="repocard__name" href={article.href} target="_blank" rel="noreferrer">
                  {article.title}
                </a>
                <time className="writing-card__date">{article.date}</time>
              </div>
              <p className="repocard__desc">{article.description}</p>
              <div className="repocard__meta">
                <span className="dotlang">● {article.category}</span>
                <span>{article.topics.join(" · ")}</span>
              </div>
              <div className="projectcard__actions">
                <a href={article.href} target="_blank" rel="noreferrer">Read article ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
