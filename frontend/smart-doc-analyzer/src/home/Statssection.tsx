import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import "../styles/Statssectionstyle.css";

const stats = [
    {
        value: 10000,
        suffix: "+",
        label: "Documents Processed",
        color: "#8b5cf6",
    },
    {
        value: 5,
        suffix: "",
        label: "AI Models Available",
        color: "#3b82f6",
    },
    {
        value: 99.9,
        suffix: "%",
        label: "Accuracy Rate",
        color: "#06b6d4",
    },
    {
        value: 50,
        suffix: "+",
        label: "Languages Supported",
        color: "#ec4899",
    },
];

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrameId: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * value);

            setCount(currentCount);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isInView, value, duration]);

    return (
        <span ref={ref} className="stat-number">
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

export default function StatsSection() {
    return (
        <section className="stats-section">
            <div className="stats-section__inner">
                <motion.div
                    className="stats-grid"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="stat-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <div className="stat-card__glow" style={{ background: stat.color, opacity: 0.1 }} />

                            <div className="stat-card__content">
                                <div className="stat-value">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>

                            <div className="stat-card__orb" style={{ background: `radial-gradient(circle, ${stat.color}40, transparent)` }} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    className="trust-indicators"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="trust-item">
                        <svg className="trust-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#eab308" />
                        </svg>
                        <span>Trusted by universities</span>
                    </div>

                    <div className="trust-item">
                        <svg className="trust-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#22c55e" strokeWidth="2" />
                            <path d="M8 12L11 15L16 9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Enterprise-grade security</span>
                    </div>

                    <div className="trust-item">
                        <svg className="trust-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>API access available</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}