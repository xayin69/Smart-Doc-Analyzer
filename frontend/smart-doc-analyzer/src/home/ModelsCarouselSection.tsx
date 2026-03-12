import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/models-carousel.css";
import { Vortex } from "../ui/vortex";

const MAX_VISIBILITY = 3;

const models = [
  {
    name: "Gemma 3 12B",
    description:
      "Primary local instruction model used for core document tasks such as summarization and general reasoning workflows.",
  },
  {
    name: "Qwen3 8B",
    description:
      "Lightweight local model suited for efficient text understanding, fast responses, and flexible experimentation.",
  },
  {
    name: "GPT-OSS 120B",
    description:
      "Large-scale reasoning model for stronger generation quality, deeper analysis, and advanced AI-assisted outputs.",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: "easeOut" as const,
      staggerChildren: 0.14,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

const carouselVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.97, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      delay: 0.15,
      ease: "easeOut" as const,
    },
  },
};

export default function ModelsCarouselSection() {
  const [active, setActive] = useState(1);
  const count = models.length;

  return (
    <section className="models-section">
      <Vortex backgroundColor="transparent" className="models-section__vortex">
        <motion.div
          className="models-section__inner"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
        <motion.p className="models-section__eyebrow" variants={itemVariants}>
          Models
        </motion.p>

          <motion.h2 className="models-section__title" variants={itemVariants}>
            Models Available
          </motion.h2>

          <motion.p className="models-section__subtitle" variants={itemVariants}>
            Smart Doc Analyzer is designed to support multiple local and advanced
            language models for different reasoning needs.
          </motion.p>

          <motion.div className="models-carousel" variants={carouselVariants}>
          {active > 0 && (
            <button
              className="models-carousel__nav models-carousel__nav--left"
              onClick={() => setActive((i) => i - 1)}
              aria-label="Previous model"
            >
              <ChevronLeft />
            </button>
          )}

          {models.map((model, i) => {
            const distanceFromActive = Math.abs(active - i);
            const offset = (active - i) / 3;
            const direction = Math.sign(active - i);
            const absOffset = distanceFromActive / 3;
            const isHidden = distanceFromActive > MAX_VISIBILITY;

            return (
              <div
                key={model.name}
                className="models-carousel__card-container"
                style={
                  {
                    "--active": i === active ? 1 : 0,
                    "--offset": offset,
                    "--direction": direction,
                    "--abs-offset": absOffset,
                    zIndex: 100 - distanceFromActive,
                    pointerEvents: i === active ? "auto" : "none",
                    opacity: distanceFromActive >= MAX_VISIBILITY ? "0" : "1",
                    display: isHidden ? "none" : "block",
                  } as React.CSSProperties
                }
              >
                <article className="models-card">
                  <div className="models-card__badge">AI MODEL</div>

                  <h3 className="models-card__title">{model.name}</h3>

                  <p className="models-card__description">
                    {model.description}
                  </p>
                </article>
              </div>
            );
          })}

          {active < count - 1 && (
            <button
              className="models-carousel__nav models-carousel__nav--right"
              onClick={() => setActive((i) => i + 1)}
              aria-label="Next model"
            >
              <ChevronRight />
            </button>
          )}
        </motion.div>
      </motion.div>
      </Vortex>
    </section>
  );
}
