import { profile } from "../data/profile";
import { Icon } from "../os/Icon";

export function AboutApp() {
  return (
    <div className="app about">
      <div className="about__hero">
        <img className="about__avatar" src="/arwin-headshot.png" alt="Arwin Karir" />
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
        <div className="about__stacks">
          {profile.stacks.map((stack) => (
            <section key={stack.name} className="about__stack">
              <h3>{stack.name}</h3>
              <div className="about__stackgrid">
                {stack.items.map((item) => (
                  <div key={item.name} className="about__stackitem" title={item.name}>
                    <img src={item.logo} alt="" width="24" height="24" />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
