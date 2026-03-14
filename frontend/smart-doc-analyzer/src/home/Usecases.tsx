import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { GraduationCap, Briefcase, FileText, BookOpen } from "lucide-react";
import "../styles/Usecasesstyle.css";

const useCases = [
    {
        icon: GraduationCap,
        title: "Academic Research",
        description: "Analyze research papers, extract key findings, and summarize complex academic content efficiently.",
        gradient: "from-purple-500 to-blue-500",
    },
    {
        icon: Briefcase,
        title: "Business Intelligence",
        description: "Process reports, contracts, and market research to make data-driven decisions faster.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: FileText,
        title: "Legal Document Analysis",
        description: "Review contracts, identify clauses, and extract critical information from legal documents.",
        gradient: "from-cyan-500 to-teal-500",
    },
    {
        icon: BookOpen,
        title: "Content Curation",
        description: "Organize articles, classify topics, and translate content for global audiences.",
        gradient: "from-pink-500 to-rose-500",
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export default function UseCases() {
    return (
        <section className="use-cases">
            <div className="use-cases__inner">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="section-eyebrow">Applications</p>
                    <h2 className="section-title">
                        Built for <span className="title-gradient">Every Use Case</span>
                    </h2>
                    <p className="section-subtitle">
                        From academic research to business intelligence, Smart Doc Analyzer adapts to your needs
                    </p>
                </motion.div>

                {/* Use Cases Grid */}
                <motion.div
                    className="use-cases-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {useCases.map((useCase, index) => {
                        const Icon = useCase.icon;
                        return (
                            <motion.div
                                key={useCase.title}
                                className="use-case-card"
                                variants={itemVariants}
                                whileHover={{
                                    y: -12,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <div className="use-case-card__inner">
                                    {/* Icon */}
                                    <div className={`use-case-icon gradient-${useCase.gradient}`}>
                                        <Icon />
                                        <div className="icon-ring" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="use-case-title">{useCase.title}</h3>
                                    <p className="use-case-description">{useCase.description}</p>

                                    {/* Learn More Link */}
                                    <a href="#" className="use-case-link">
                                        <span>Learn more</span>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path
                                                d="M3 8h10m0 0l-4-4m4 4l-4 4"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </a>
                                </div>

                                <div className="use-case-glow" />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}