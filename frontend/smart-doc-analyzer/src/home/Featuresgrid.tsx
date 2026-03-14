import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
    FileText,
    Languages,
    Brain,
    TrendingUp,
    MessageSquareText,
    Zap,
    Shield,
    Sparkles,
} from "lucide-react";
import "../styles/Featuresgridstyle.css";

const features = [
    {
        icon: FileText,
        title: "Smart Summarization",
        description: "Generate concise, accurate summaries from lengthy documents using advanced chunk-based processing.",
        gradient: "from-purple-500 to-blue-500",
        size: "large",
    },
    {
        icon: Languages,
        title: "Multi-Language Translation",
        description: "Translate documents into 50+ languages instantly with context-aware AI.",
        gradient: "from-blue-500 to-cyan-500",
        size: "medium",
    },
    {
        icon: Brain,
        title: "Topic Classification",
        description: "Automatically identify themes and categorize your documents.",
        gradient: "from-cyan-500 to-teal-500",
        size: "medium",
    },
    {
        icon: TrendingUp,
        title: "Sentiment Analysis",
        description: "Detect emotional tone and sentiment patterns across your content.",
        gradient: "from-purple-500 to-pink-500",
        size: "medium",
    },
    {
        icon: MessageSquareText,
        title: "RAG-Powered Q&A",
        description: "Ask questions and get context-aware answers from your document library.",
        gradient: "from-pink-500 to-rose-500",
        size: "medium",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Process documents in seconds with optimized AI models.",
        gradient: "from-yellow-500 to-orange-500",
        size: "small",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Your documents stay private with end-to-end encryption.",
        gradient: "from-green-500 to-emerald-500",
        size: "small",
    },
    {
        icon: Sparkles,
        title: "AI-Powered Insights",
        description: "Discover patterns and insights you'd miss manually.",
        gradient: "from-indigo-500 to-purple-500",
        size: "small",
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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

export default function FeaturesGrid() {
    return (
        <section className="features-grid-section">
            <div className="features-grid-section__inner">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="section-eyebrow">Features</p>
                    <h2 className="section-title">
                        Everything You Need to
                        <br />
                        <span className="title-gradient">Analyze Documents</span>
                    </h2>
                    <p className="section-subtitle">
                        Powerful AI capabilities designed for modern document workflows
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    className="bento-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                className={`bento-card bento-card--${feature.size}`}
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <div className="bento-card__glow" />

                                <div className={`bento-card__icon gradient-${feature.gradient}`}>
                                    <Icon />
                                    <div className="icon-glow" />
                                </div>

                                <div className="bento-card__content">
                                    <h3 className="bento-card__title">{feature.title}</h3>
                                    <p className="bento-card__description">
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="bento-card__decorative-orb" />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}