import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Vortex } from "../ui/vortex";

export default function HeroSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="hero-section">
      <Vortex backgroundColor="transparent" className="hero-section__vortex">
        <div className="hero-section__content">
          <h1 className="hero-section__title">
            <span
              className="hero-section__title-text"
              data-text="Intelligent document analysis for modern workflows"
            >
              Intelligent document analysis for modern workflows
            </span>
          </h1>

          <p className="hero-section__text">
            Summarize, translate, classify topics, analyze sentiment, and ask
            questions across your documents in one clean AI workspace.
          </p>

          <div className="hero-section__actions">
            <Link
              to={isAuthenticated ? "/workspace" : "/login"}
              className="hero-section__primary"
            >
              Get Started
            </Link>

            <Link to="/login" className="hero-section__secondary">
              Log in →
            </Link>
          </div>
        </div>
      </Vortex>
    </section>
  );
}
