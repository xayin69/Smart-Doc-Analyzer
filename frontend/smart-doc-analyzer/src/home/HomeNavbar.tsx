import { NavLink, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedSmartDocIcon from "../components/icons/AnimatedSmartDocIcon";
import "../styles/home-navbar.css";

const navigation = [
  { name: "Home", to: "/" },
  { name: "Team", to: "/team" },
  { name: "Feedback", to: "/feedback" },
  { name: "Profile", to: "/profile" },
];

export default function HomeNavbar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0.55, 0.85]);
  const blur = useTransform(scrollY, [0, 100], [16, 24]);

  return (
    <motion.header
      className="home-navbar-enhanced"
      style={{
        // @ts-ignore
        "--navbar-opacity": opacity,
        "--navbar-blur": blur,
      }}
    >
      {/* Animated border gradient */}
      <div className="navbar-border-gradient" />

      <div className="home-navbar-enhanced__inner">
        {/* Logo */}
        <Link to="/" className="home-navbar-enhanced__brand">
          <motion.div
            className="navbar-logo-wrapper"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <AnimatedSmartDocIcon className="home-navbar-enhanced__logo" />
            <div className="logo-glow" />
          </motion.div>
          <span className="home-navbar-enhanced__title">
            Smart Doc Analyzer
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="home-navbar-enhanced__nav">
          {navigation.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                isActive ? "navbar-link navbar-link--active" : "navbar-link"
              }
            >
              <motion.div
                className="navbar-link__wrapper"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <span className="navbar-link__text">{item.name}</span>
                <div className="navbar-link__underline" />
              </motion.div>
            </NavLink>
          ))}
        </nav>

        {/* Auth Button */}
        <div className="home-navbar-enhanced__auth">
          <Link to="/signup" className="navbar-signup-btn">
            <span className="signup-btn__text">Sign up</span>
            <svg
              className="signup-btn__arrow"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M1 8h14m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="signup-btn__glow" />
          </Link>
        </div>
      </div>

      {/* Floating particles */}
      <div className="navbar-particles">
        <span className="particle particle-1" />
        <span className="particle particle-2" />
        <span className="particle particle-3" />
      </div>
    </motion.header>
  );
}
