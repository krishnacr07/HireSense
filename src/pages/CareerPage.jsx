import { careers } from "../Data/careers";
import CareerCard from "../components/CareerCard";
import "./CareerPage.css";
import Navbar from "../components/Navbar";

function CareerPage() {
  return (
    <>
    <Navbar/>
    <div className="career-page">
      <p className="career-page__title">
        Discover Your <i>Path</i>
      </p>
      <p className="career-page__subtitle">
        Choose a direction and start building real-world skills that matter.
      </p>

      <div className="career-page__grid">
        {careers.map((career) => (
          <CareerCard key={career.id} career={career} />
        ))}
      </div>
    </div>
    </>
  );
}

export default CareerPage;
