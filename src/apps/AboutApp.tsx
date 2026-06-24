import { profile } from "../data/profile";
import { Icon } from "../os/Icon";

export function AboutApp() {
  return (
    <div className="app about">
      <div className="about__hero">
        <div className="about__avatar">AK</div>
        <div>
          <h1 className="about__name">{profile.name}</h1>
          <p className="about__tag">{profile.tagline}</p>
          <p className="about__loc">
            <span className="inlineico">
              <Icon name="pin" size={16} />
            </span>
            {profile.location}
          </p>
        </div>
      </div>

      <p className="about__blurb">{profile.blurb}</p>

      <div className="about__card">
        <h3>
          <span className="inlineico">
            <Icon name="education" size={20} />
          </span>
          Education
        </h3>
        <p className="about__edu-school">{profile.education.school}</p>
        <p className="about__edu-degree">{profile.education.degree}</p>
        <p className="about__edu-meta">
          {profile.education.location} · {profile.education.dates}
        </p>
      </div>

      <div className="about__card">
        <h3>
          <span className="inlineico">
            <Icon name="skills" size={20} />
          </span>
          Skills
        </h3>
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
    </div>
  );
}
