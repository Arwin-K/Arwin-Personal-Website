import { useEffect, useState } from "react";
import { profile } from "../data/profile";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  location: string | null;
  company: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

const API = "https://api.github.com";

// Tiny in-memory cache so the user and projects apps don't double-fetch.
let userCache: GitHubUser | null = null;
let reposCache: GitHubRepo[] | null = null;

export function useGitHubUser() {
  const [user, setUser] = useState<GitHubUser | null>(userCache);
  const [loading, setLoading] = useState(!userCache);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (userCache) return;
    let active = true;
    fetch(`${API}/users/${profile.githubUser}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: GitHubUser) => {
        userCache = data;
        if (active) setUser(data);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { user, loading, error };
}

export function useGitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>(reposCache ?? []);
  const [loading, setLoading] = useState(!reposCache);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (reposCache) return;
    let active = true;
    fetch(`${API}/users/${profile.githubUser}/repos?per_page=100&sort=updated`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: GitHubRepo[]) => {
        const cleaned = data
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.updated_at) - +new Date(a.updated_at));
        reposCache = cleaned;
        if (active) setRepos(cleaned);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { repos, loading, error };
}

export function languageBreakdown(repos: GitHubRepo[]): [string, number][] {
  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}
