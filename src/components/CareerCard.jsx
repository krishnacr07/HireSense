import { useNavigate } from "react-router-dom";
import "./CareerCard.css";

function CareerCard({ career }) {
  const navigate = useNavigate();

  return (
    <div
      className="career-card"
      onClick={() => navigate(`/career/${career.id}`)}
      style={{ "--card-accent": career.color }}
    >
      <h2 className="career-card__title">{career.title}</h2>
      <p className="career-card__desc">{career.shortDesc}</p>
      <span className="career-card__link">Explore →</span>
    </div>
  );
}

export default CareerCard;