import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Sparkles, Zap, Brain } from "lucide-react";
import "../styles/HeroSectionstyle.css";

export default function HeroSectionEnhanced() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="hero-enhanced">
      <div className="hero-enhanced__content">
          {/* Badge */}
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="hero-badge__icon" />
            <span>Powered by Advanced AI Models</span>
            <div className="hero-badge__glow" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="hero-enhanced__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="title-line title-line-1">
              Intelligent Document
            </span>
            <span className="title-line title-line-2">
              Analysis for
            </span>
            <span className="title-line title-line-3">
              <span className="gradient-text">Modern Workflows</span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="hero-enhanced__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Summarize, translate, classify topics, analyze sentiment, and ask
            questions across your documents in one clean AI workspace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-enhanced__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              to={isAuthenticated ? "/workspace" : "/login"}
              className="hero-btn hero-btn--primary"
            >
              <Zap className="hero-btn__icon" />
              <span>Get Started Free</span>
              <div className="hero-btn__glow" />
            </Link>

            <Link to="/team" className="hero-btn hero-btn--secondary">
              <Brain className="hero-btn__icon" />
              <span>See How It Works</span>
            </Link>
          </motion.div>

          {/* Features Tags */}
          <motion.div
            className="hero-features-tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="feature-tag">
              <svg className="feature-tag__check" width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.5 4L6 11.5 2.5 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              No credit card required
            </span>
            <span className="feature-tag">
              <svg className="feature-tag__check" width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.5 4L6 11.5 2.5 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              5 AI models included
            </span>
            <span className="feature-tag">
              <svg className="feature-tag__check" width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.5 4L6 11.5 2.5 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Advanced analytics
            </span>
          </motion.div>
        </div>

        {/* AI Brain Illustration */}
        <motion.div
          className="hero-brain-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <svg
            className="hero-brain"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Brain outline */}
            <path
              className="brain-path brain-path-1"
              d="M200 80C160 80 130 100 120 130C110 100 90 90 70 100C50 110 45 135 55 160C45 170 40 185 45 200C40 215 45 230 55 240C45 265 50 290 70 300C90 310 110 300 120 270C130 300 160 320 200 320C240 320 270 300 280 270C290 300 310 310 330 300C350 290 355 265 345 240C355 230 360 215 355 200C360 185 355 170 345 160C355 135 350 110 330 100C310 90 290 100 280 130C270 100 240 80 200 80Z"
              stroke="url(#brainGradient1)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Neural network connections */}
            <g className="neural-connections">
              <line x1="150" y1="150" x2="180" y2="180" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6" className="connection connection-1" />
              <line x1="180" y1="180" x2="220" y2="180" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6" className="connection connection-2" />
              <line x1="220" y1="180" x2="250" y2="150" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6" className="connection connection-3" />
              <line x1="150" y1="220" x2="180" y2="220" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6" className="connection connection-4" />
              <line x1="180" y1="220" x2="220" y2="220" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6" className="connection connection-5" />
              <line x1="220" y1="220" x2="250" y2="250" stroke="url(#connectionGradient)" strokeWidth="2" opacity="0.6" className="connection connection-6" />
            </g>

            {/* Neural nodes */}
            <g className="neural-nodes">
              <circle cx="150" cy="150" r="6" fill="#8b5cf6" className="node node-1" />
              <circle cx="180" cy="180" r="8" fill="#3b82f6" className="node node-2" />
              <circle cx="220" cy="180" r="8" fill="#06b6d4" className="node node-3" />
              <circle cx="250" cy="150" r="6" fill="#8b5cf6" className="node node-4" />
              <circle cx="150" cy="220" r="6" fill="#ec4899" className="node node-5" />
              <circle cx="180" cy="220" r="8" fill="#8b5cf6" className="node node-6" />
              <circle cx="220" cy="220" r="8" fill="#3b82f6" className="node node-7" />
              <circle cx="250" cy="250" r="6" fill="#06b6d4" className="node node-8" />
            </g>

            {/* Central pulse */}
            <circle cx="200" cy="200" r="30" fill="url(#pulseGradient)" opacity="0.3" className="central-pulse" />
            <circle cx="200" cy="200" r="20" fill="url(#pulseGradient)" opacity="0.5" className="central-pulse-inner" />

            {/* Gradients */}
            <defs>
              <linearGradient id="brainGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <radialGradient id="pulseGradient">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </radialGradient>
            </defs>
          </svg>

          {/* Floating orbs around brain */}
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
        </motion.div>

      {/* Floating Elements */}
      <div className="hero-floating-elements">
        <motion.div
          className="floating-card floating-card-1"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles size={20} />
          <span>AI Powered</span>
        </motion.div>

        <motion.div
          className="floating-card floating-card-2"
          animate={{
            y: [0, -20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Brain size={20} />
          <span>Smart Analysis</span>
        </motion.div>

        <motion.div
          className="floating-card floating-card-3"
          animate={{
            y: [0, -18, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Zap size={20} />
          <span>Lightning Fast</span>
        </motion.div>
      </div>
    </section>
  );
}