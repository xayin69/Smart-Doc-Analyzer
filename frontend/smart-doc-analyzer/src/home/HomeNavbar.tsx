import { Link } from "react-router-dom";
import  AnimatedSmartDocIcon  from "../components/icons/AnimatedSmartDocIcon";
import "../styles/home-navbar.css";

const navigation = [
  { name: "Home", to: "/" },
  { name: "Team", to: "/team" },
  { name: "Feedback", to: "/feedback" },
  { name: "Profile", to: "/profile" },
];

export default function HomeNavbar() {
  return (
    <header className="home-navbar">
      <div className="home-navbar__inner">
        <Link to="/" className="home-navbar__brand">
          <AnimatedSmartDocIcon className="home-navbar__logo" />
          <span className="home-navbar__title">Smart Doc Analyzer</span>
        </Link>

        <nav className="home-navbar__nav">
          {navigation.map((item) => (
            <Link key={item.name} to={item.to} className="home-navbar__link">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="home-navbar__auth">
          <Link to="/signup" className="home-navbar__signup">
            Sign up →
          </Link>
        </div>
      </div>
    </header>
  );
}
