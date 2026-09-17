import { useMemo } from "react";
import { useGitHubRepos, type GitHubRepo } from "../hooks/useGitHub";
import { Icon } from "../os/Icon";

const FEATURED_REPOSITORIES = new Set([
  "LumiSense",
  "Fake-News-Detection",
  "CUDA-Attention-Softmax",
  "sellstatic-website",
]);

function RepositoryCard({ repo }: { repo: GitHubRepo }) {
  const documentationUrl = `${repo.html_url}/blob/${repo.default_branch}/README.md`;

  return (
    <article className="repocard projectcard">
      <div className="repocard__top">
        <a className="repocard__name" href={repo.html_url} target="_blank" rel="noreferrer">
          {repo.name}
        </a>
        <span className="repocard__star">
          <Icon name="star" size={13} /> {repo.stargazers_count}
        </span>
      </div>
      <p className="repocard__desc">
        {repo.description ?? "Project documentation and source code are available on GitHub."}
      </p>
      <div className="repocard__meta">
        {repo.language && <span className="dotlang">● {repo.language}</span>}
        <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
      <div className="projectcard__actions">
        <a href={repo.html_url} target="_blank" rel="noreferrer">Repository ↗</a>
        <a href={documentationUrl} target="_blank" rel="noreferrer">Documentation ↗</a>
        {repo.homepage && <a href={repo.homepage} target="_blank" rel="noreferrer">Live site ↗</a>}
      </div>
    </article>
  );
}

export function ProjectsApp() {
  const { repos, loading, error } = useGitHubRepos();
  const { featured, remaining } = useMemo(() => {
    const active = repos.filter((repo) => !repo.fork && !repo.archived);
    return {
      featured: active.filter((repo) => FEATURED_REPOSITORIES.has(repo.name)),
      remaining: active.filter((repo) => !FEATURED_REPOSITORIES.has(repo.name)),
    };
  }, [repos]);

  return (
    <div className="app folder projects">
      <div className="projects__intro">
        <div>
          <h2>Projects</h2>
          <p>Selected engineering work and public repositories, synchronized directly from GitHub.</p>
        </div>
        <a className="btn btn--primary" href="https://github.com/Arwin-K" target="_blank" rel="noreferrer">
          GitHub profile ↗
        </a>
      </div>

      {loading && <p className="muted">Loading repositories from GitHub…</p>}
      {error && <p className="muted">GitHub is temporarily unavailable. Please visit the GitHub profile to view the current project list.</p>}

      {featured.length > 0 && (
        <section>
          <h3 className="folder__section">Featured work</h3>
          <div className="repolist">{featured.map((repo) => <RepositoryCard key={repo.id} repo={repo} />)}</div>
        </section>
      )}

      {remaining.length > 0 && (
        <section>
          <h3 className="folder__section">Additional repositories</h3>
          <div className="repolist">{remaining.map((repo) => <RepositoryCard key={repo.id} repo={repo} />)}</div>
        </section>
      )}
    </div>
  );
}
