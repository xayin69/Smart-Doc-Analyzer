import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Upload, Brain, Download } from "lucide-react";
import "../styles/Howitworksstyle.css";

const steps = [
    {
        number: "01",
        icon: Upload,
        title: "Upload Your Document",
        description: "Drag and drop or select files from your device. We support PDF, DOCX, TXT, and more.",
        gradient: "from-purple-500 to-blue-500",
    },
    {
        number: "02",
        icon: Brain,
        title: "AI Analyzes Content",
        description: "Our advanced models process your document using cutting-edge NLP and machine learning techniques.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        number: "03",
        icon: Download,
        title: "Get Instant Results",
        description: "View summaries, translations, sentiment analysis, and more in seconds. Export or share as needed.",
        gradient: "from-cyan-500 to-teal-500",
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export default function HowItWorks() {
    return (
        <section className="how-it-works">
            <div className="how-it-works__inner">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="section-eyebrow">Process</p>
                    <h2 className="section-title">
                        How It <span className="title-gradient">Works</span>
                    </h2>
                    <p className="section-subtitle">
                        Get from document to insights in three simple steps
                    </p>
                </motion.div>

                {/* Steps Flow */}
                <motion.div
                    className="steps-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                className="step-card"
                                variants={itemVariants}
                            >
                                {/* Connecting Line */}
                                {index < steps.length - 1 && (
                                    <div className="step-connector">
                                        <svg className="connector-line" viewBox="0 0 200 2">
                                            <line
                                                x1="0"
                                                y1="1"
                                                x2="200"
                                                y2="1"
                                                stroke="url(#connectorGradient)"
                                                strokeWidth="2"
                                                strokeDasharray="4 4"
                                            />
                                            <defs>
                                                <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="rgba(139, 92, 246, 0.5)" />
                                                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.5)" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="connector-pulse" />
                                    </div>
                                )}

                                <div className="step-content">
                                    {/* Number Badge */}
                                    <div className="step-number">{step.number}</div>

                                    {/* Icon */}
                                    <div className={`step-icon gradient-${step.gradient}`}>
                                        <Icon />
                                        <div className="icon-pulse" />
                                    </div>

                                    {/* Text */}
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>

                                {/* Decorative Elements */}
                                <div className="step-glow" />
                                <div className="step-particles">
                                    <span className="particle" />
                                    <span className="particle" />
                                    <span className="particle" />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CTA */}
                <motion.div
                    className="how-it-works-cta"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <a href="/signup" className="cta-button">
                        <span>Start Analyzing Now</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M4 10h12m0 0l-5-5m5 5l-5 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="cta-button-glow" />
                    </a>
                    <p className="cta-note">No credit card required • Free to start</p>
                </motion.div>
            </div>
        </section>
    );
}