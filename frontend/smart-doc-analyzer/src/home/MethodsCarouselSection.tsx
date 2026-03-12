import { motion } from "framer-motion";
import { useState } from "react";
import {
  NotebookText,
  Languages,
  Smile,
  LibraryBig,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../styles/task-carousel.css";
import { Vortex } from "../ui/vortex";

const MAX_VISIBILITY = 3;

const methods = [
  {
    name: "Summarization",
    description:
      "Generate concise document summaries for long files using chunk-based processing.",
    Icon: NotebookText,
  },
  {
    name: "Translation",
    description:
      "Translate document content into the selected target language with one click.",
    Icon: Languages,
  },
  {
    name: "Sentiment Analysis",
    description:
      "Detect the emotional tone of text and return the overall sentiment clearly.",
    Icon: Smile,
  },
  {
    name: "Topic Classification",
    description:
      "Identify the main themes and categories present in your uploaded document.",
    Icon: LibraryBig,
  },
  {
    name: "RAG Q&A",
    description:
      "Ask questions about your documents and receive context-aware AI answers.",
    Icon: MessageSquareText,
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

export default function MethodsCarouselSection() {
  const [active, setActive] = useState(2);
  const count = methods.length;

  return (
    <section className="methods-section">
      <Vortex backgroundColor="transparent" className="methods-section__vortex">
        <motion.div
          className="methods-section__inner"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
        <motion.p className="methods-section__eyebrow" variants={itemVariants}>
          Capabilities
        </motion.p>

          <motion.h2 className="methods-section__title" variants={itemVariants}>
            Methods Available
          </motion.h2>

          <motion.p
            className="methods-section__subtitle"
            variants={itemVariants}
          >
            Explore the core AI methods currently available in Smart Doc Analyzer.
          </motion.p>

          <motion.div className="methods-carousel" variants={carouselVariants}>
          {active > 0 && (
            <button
              className="methods-carousel__nav methods-carousel__nav--left"
              onClick={() => setActive((i) => i - 1)}
              aria-label="Previous method"
            >
              <ChevronLeft />
            </button>
          )}

          {methods.map((method, i) => {
            const Icon = method.Icon;
            const distanceFromActive = Math.abs(active - i);
            const offset = (active - i) / 3;
            const direction = Math.sign(active - i);
            const absOffset = distanceFromActive / 3;
            const isHidden = distanceFromActive > MAX_VISIBILITY;

            return (
              <div
                key={method.name}
                className="methods-carousel__card-container"
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
                <article className="methods-card">
                  <div className="methods-card__icon-wrap">
                    <Icon className="methods-card__icon" />
                  </div>

                  <h3 className="methods-card__title">{method.name}</h3>

                  <p className="methods-card__description">
                    {method.description}
                  </p>
                </article>
              </div>
            );
          })}

          {active < count - 1 && (
            <button
              className="methods-carousel__nav methods-carousel__nav--right"
              onClick={() => setActive((i) => i + 1)}
              aria-label="Next method"
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
