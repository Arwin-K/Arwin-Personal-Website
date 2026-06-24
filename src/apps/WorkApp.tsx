import { work } from "../data/work";
import { Icon } from "../os/Icon";

export function WorkApp() {
  return (
    <div className="app work">
      <p className="work__intro">
        Roles I've held, with the full rundown of what I worked on at each.
      </p>
      {work.map((item) => (
        <article key={item.id} className="doc work__item">
          <div className="doc__head">
            <Icon name={item.icon} size={30} />
            <div>
              <h2 className="doc__title">{item.role}</h2>
              <p className="doc__sub">
                {item.company} · {item.location}
              </p>
              <p className="doc__meta">{item.dates}</p>
            </div>
          </div>
          <ul className="doc__list">
            {item.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
