import { useGitHubUser, useGitHubRepos, languageBreakdown } from "../hooks/useGitHub";
import { profile } from "../data/profile";
import { Icon } from "../os/Icon";

export function GitHubApp() {
  const { user, loading, error } = useGitHubUser();
  const { repos } = useGitHubRepos();
  const langs = languageBreakdown(repos).slice(0, 6);
  const maxLang = langs[0]?.[1] ?? 1;
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  if (loading) {
    return (
      <div className="app github">
        <p className="muted">Fetching @{profile.githubUser} from GitHub…</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="app github">
        <p className="muted">GitHub's API didn't respond (it rate-limits sometimes).</p>
        <a className="btn btn--primary" href={profile.github} target="_blank" rel="noreferrer">
          Open github.com/{profile.githubUser} →
        </a>
      </div>
    );
  }

  return (
    <div className="app github">
      <div className="github__head">
        <img className="github__avatar" src={user.avatar_url} alt={user.login} />
        <div>
          <h2 className="github__name">{user.name ?? user.login}</h2>
          <a className="github__login" href={user.html_url} target="_blank" rel="noreferrer">
            @{user.login}
          </a>
          {user.bio && <p className="github__bio">{user.bio}</p>}
        </div>
      </div>

      <div className="github__stats">
        <Stat n={user.public_repos} label="Repos" />
        <Stat n={user.followers} label="Followers" />
        <Stat n={user.following} label="Following" />
        <Stat n={totalStars} label="Stars" />
      </div>

      <div className="github__card">
        <h3>Contributions</h3>
        <a
          className="github__contrib"
          href={`${user.html_url}`}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={`https://ghchart.rshah.org/2f7d3a/${user.login}`}
            alt={`${user.login} GitHub contribution chart`}
            loading="lazy"
          />
        </a>
      </div>

      {langs.length > 0 && (
        <div className="github__card">
          <h3>Top languages</h3>
          {langs.map(([lang, count]) => (
            <div key={lang} className="langrow">
              <span className="langrow__label">{lang}</span>
              <div className="langrow__bar">
                <div className="langrow__fill" style={{ width: `${(count / maxLang) * 100}%` }} />
              </div>
              <span className="langrow__count">{count}</span>
            </div>
          ))}
        </div>
      )}

      <div className="github__card">
        <h3>Recent & popular repos</h3>
        <div className="repolist">
          {repos.slice(0, 6).map((r) => (
            <a key={r.id} className="repocard" href={r.html_url} target="_blank" rel="noreferrer">
              <div className="repocard__top">
                <span className="repocard__name">{r.name}</span>
                <span className="repocard__star">
                  <Icon name="star" size={13} /> {r.stargazers_count}
                </span>
              </div>
              {r.description && <p className="repocard__desc">{r.description}</p>}
              {r.language && <span className="dotlang">● {r.language}</span>}
            </a>
          ))}
        </div>
      </div>

      <a className="btn btn--primary" href={user.html_url} target="_blank" rel="noreferrer">
        View full profile →
      </a>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="stat">
      <span className="stat__n">{n}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}
