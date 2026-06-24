import { profile } from "../data/profile";
import { Icon } from "../os/Icon";

export function ContactApp() {
  return (
    <div className="app contact">
      <h2 className="contact__title">Let's build something 👋</h2>
      <p className="muted">
        Open to internships, collaborations, and pickup games. The fastest way to reach me is email.
      </p>
      <div className="contact__list">
        <a className="contact__row" href={`mailto:${profile.email}`}>
          <span className="contact__ic">
            <Icon name="mail" size={26} />
          </span>
          <div>
            <span className="contact__label">Email</span>
            <span className="contact__val">{profile.email}</span>
          </div>
        </a>
        <a className="contact__row" href={`tel:${profile.phone}`}>
          <span className="contact__ic">
            <Icon name="phone" size={26} />
          </span>
          <div>
            <span className="contact__label">Phone</span>
            <span className="contact__val">{profile.phone}</span>
          </div>
        </a>
        <a className="contact__row" href={profile.linkedin} target="_blank" rel="noreferrer">
          <span className="contact__ic">
            <Icon name="linkedin" size={26} />
          </span>
          <div>
            <span className="contact__label">LinkedIn</span>
            <span className="contact__val">/in/{profile.linkedinHandle}</span>
          </div>
        </a>
        <a className="contact__row" href={profile.github} target="_blank" rel="noreferrer">
          <span className="contact__ic">
            <Icon name="github" size={26} />
          </span>
          <div>
            <span className="contact__label">GitHub</span>
            <span className="contact__val">@{profile.githubUser}</span>
          </div>
        </a>
        <a className="contact__row" href={profile.x} target="_blank" rel="noreferrer">
          <span className="contact__ic">
            <Icon name="x" size={26} />
          </span>
          <div>
            <span className="contact__label">X</span>
            <span className="contact__val">@{profile.xHandle}</span>
          </div>
        </a>
        <a className="contact__row" href={profile.instagram} target="_blank" rel="noreferrer">
          <span className="contact__ic">
            <Icon name="instagram" size={26} />
          </span>
          <div>
            <span className="contact__label">Instagram</span>
            <span className="contact__val">@{profile.instagramHandle}</span>
          </div>
        </a>
      </div>
    </div>
  );
}
