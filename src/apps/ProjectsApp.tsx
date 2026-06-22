import { useState } from "react";
import { featuredProjects, type FeaturedProject } from "../data/projects";
import { useGitHubRepos } from "../hooks/useGitHub";
import { Icon } from "../os/Icon";

export function ProjectsApp() {
  const [selected, setSelected] = useState<FeaturedProject | null>(null);
  const { repos, loading, error } = useGitHubRepos();

  if (selected) {
    return (
      <div className="app folder">
        <button className="folder__back" onClick={() => setSelected(null)}>
          ← Projects
        </button>
        <div className="doc">
          <div className="doc__head">
            <Icon name="file" size={30} />
            <div>
              <h2 className="doc__title">{selected.name}</h2>
              <p className="doc__meta">{selected.dates}</p>
            </div>
          </div>
          <div className="chips chips--tight">
            {selected.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          <p className="doc__blurb">{selected.blurb}</p>
          <ul className="doc__list">
            {selected.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          {selected.repo && (
            <a className="btn btn--primary" href={selected.repo} target="_blank" rel="noreferrer">
              View on GitHub →
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app folder">
      <p className="folder__hint">Featured builds — double-click for the full rundown.</p>
      <div className="folder__grid">
        {featuredProjects.map((p) => (
          <button key={p.id} className="fileitem" onClick={() => setSelected(p)}>
            <Icon name="file" size={40} />
            <span className="fileitem__name">{p.name}</span>
            <span className="fileitem__meta">{p.stack[0]}</span>
          </button>
        ))}
      </div>

      <h3 className="folder__section">📡 Live from GitHub</h3>
      {loading && <p className="muted">Loading repositories…</p>}
      {error && <p className="muted">Couldn't reach GitHub right now. Try the GitHub app or my profile directly.</p>}
      <div className="repolist">
        {repos.map((r) => (
          <a key={r.id} className="repocard" href={r.html_url} target="_blank" rel="noreferrer">
            <div className="repocard__top">
              <span className="repocard__name">{r.name}</span>
              <span className="repocard__star">⭐ {r.stargazers_count}</span>
            </div>
            {r.description && <p className="repocard__desc">{r.description}</p>}
            <div className="repocard__meta">
              {r.language && <span className="dotlang">● {r.language}</span>}
              <span>Updated {new Date(r.updated_at).toLocaleDateString()}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
