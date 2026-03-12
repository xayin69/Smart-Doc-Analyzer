import { motion } from "framer-motion";
import "../styles/home.css";

export default function HomeFooter() {
  return (
    <motion.footer
      className="home-footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <p className="home-footer__text">
        Copyright © 2026 Irbid National University
      </p>
    </motion.footer>
  );
}