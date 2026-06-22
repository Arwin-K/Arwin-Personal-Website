export function ResumeApp() {
  return (
    <div className="app resume">
      <div className="resume__bar">
        <span className="resume__name">Arwin_Karir_Resume.pdf</span>
        <a className="btn btn--primary" href="/resume.pdf" download>
          ⬇ Download
        </a>
      </div>
      <iframe className="resume__frame" src="/resume.pdf#toolbar=0&view=FitH" title="Arwin Karir Resume" />
    </div>
  );
}
