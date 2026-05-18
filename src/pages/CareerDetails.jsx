import { useParams, useNavigate } from "react-router-dom";
import { careers } from "../Data/careers";
import "./CareerDetails.css";
import Navbar from "../components/Navbar";

function CareerDetails() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const career = careers.find((c) => c.id === careerId);

  if (!career) {
    return (
      <div className="cd-not-found">
        <p>Career not found.</p>
        <button onClick={() => navigate("/career")}>← Back</button>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="cd-page" style={{ "--accent": career.color }}>
      {/* Back */}
      <button className="cd-back" onClick={() => navigate("/career")}>
        ← Back to Careers
      </button>

      {/* Hero */}
      <div className="cd-hero">
        <span className="cd-icon">{career.icon}</span>
        <div>
          <h1 className="cd-title">{career.title}</h1>
          <p className="cd-tagline">{career.tagline}</p>
        </div>
        <div className="cd-badges">
          <span className="cd-badge">
            💰 <strong>{career.avgSalary}</strong>
          </span>
          <span className="cd-badge cd-badge--demand">
            📈 Demand: <strong>{career.demand}</strong>
          </span>
        </div>
      </div>

      <div className="cd-body">
        {/* Skills */}
        <section className="cd-section">
          <h2 className="cd-section-title">Skills You'll Learn</h2>
          <div className="cd-skills">
            {career.skills.map((skill) => (
              <span key={skill} className="cd-skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="cd-section">
          <h2 className="cd-section-title">Learning Roadmap</h2>
          <div className="cd-roadmap">
            {career.roadmap.map((phase, i) => (
              <div key={i} className="cd-phase">
                <div className="cd-phase__header">
                  <span className="cd-phase__num">{i + 1}</span>
                  <div>
                    <h3 className="cd-phase__name">{phase.phase}</h3>
                    <span className="cd-phase__duration">{phase.duration}</span>
                  </div>
                </div>
                <ul className="cd-phase__topics">
                  {phase.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="cd-bottom-row">
          {/* Companies */}
          <section className="cd-section cd-section--half">
            <h2 className="cd-section-title">Top Hiring Companies</h2>
            <div className="cd-companies">
              {career.companies.map((c) => (
                <span key={c} className="cd-company">
                  {c}
                </span>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="cd-section cd-section--half">
            <h2 className="cd-section-title">Free Resources</h2>
            <ul className="cd-resources">
              {career.resources.map((r) => (
                <li key={r.name}>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.name} →
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}

export default CareerDetails;
