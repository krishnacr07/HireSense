import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <span className="navbar__brand" onClick={() => navigate("/")}>
        HireSense
      </span>
      <div className="navbar__links">
        <button
          className={`navbar__link ${location.pathname === "/career" ? "navbar__link--active" : ""}`}
          onClick={() => navigate("/career")}
        >
          Career Paths
        </button>
        <button
          className={`navbar__link ${location.pathname === "/resume" ? "navbar__link--active" : ""}`}
          onClick={() => navigate("/resume")}
        >
          Resume
        </button>
      </div>
    </nav>
  );
}