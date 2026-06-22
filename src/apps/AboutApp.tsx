import { profile } from "../data/profile";

export function AboutApp() {
  return (
    <div className="app about">
      <div className="about__hero">
        <div className="about__avatar">AK</div>
        <div>
          <h1 className="about__name">{profile.name}</h1>
          <p className="about__tag">{profile.tagline}</p>
          <p className="about__loc">📍 {profile.location}</p>
        </div>
      </div>

      <p className="about__blurb">{profile.blurb}</p>

      <div className="about__card">
        <h3>🎓 Education</h3>
        <p className="about__edu-school">{profile.education.school}</p>
        <p className="about__edu-degree">{profile.education.degree}</p>
        <p className="about__edu-meta">
          {profile.education.location} · {profile.education.dates}
        </p>
      </div>

      <div className="about__card">
        <h3>🧰 Skills</h3>
        {Object.entries(profile.skills).map(([group, items]) => (
          <div key={group} className="about__skillgroup">
            <span className="about__skilllabel">{group}</span>
            <div className="chips">
              {items.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="about__links">
        <a className="btn" href={`mailto:${profile.email}`}>
          ✉️ Email
        </a>
        <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
          🐙 GitHub
        </a>
        <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
          🔗 LinkedIn
        </a>
      </div>
    </div>
  );
}
