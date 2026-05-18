import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="hero-root">
      <div className="hero-inner">
        <p className="hero-eyebrow">Your Career, Your Terms</p>

        <h1 className="hero-title">
          Build your future{" "}
          <em>
            with
            <br />
            clarity
          </em>
        </h1>

        <p className="hero-sub">
          Choose your path — or let us sharpen the resume that gets you there.
        </p>

        <button className="btn btn-primary" onClick={() => navigate("/career")}>
          <span className="btn-icon">→</span>
          Choose Your Path
          <span className="btn-icon">↗</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/resume")}
        >
          <span className="btn-icon">📄</span>
          Optimize Resume
          <span className="btn-icon">↗</span>
        </button>

        <div className="hero-footnote">
          <span>No account required</span>
          <span className="dot" />
        </div>
      </div>
    </div>
  );
}
