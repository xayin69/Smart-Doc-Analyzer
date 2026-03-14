type IconProps = { className?: string };

const sentimentIconStyles = `
  .mouth { opacity: 0; }
  .mouth-happy { opacity: 1; }

  @keyframes mouthHappy {
    0%, 28% { opacity: 1; }
    33%, 100% { opacity: 0; }
  }

  @keyframes mouthNeutral {
    0%, 32% { opacity: 0; }
    33%, 64% { opacity: 1; }
    65%, 100% { opacity: 0; }
  }

  @keyframes mouthSad {
    0%, 64% { opacity: 0; }
    65%, 100% { opacity: 1; }
  }

  @keyframes tearShow {
    0%, 70% { opacity: 0; }
    71%, 100% { opacity: 0.55; }
  }

  .animate-moodLoop .mouth-happy { animation: mouthHappy 1.35s ease-in-out infinite; }
  .animate-moodLoop .mouth-neutral { animation: mouthNeutral 1.35s ease-in-out infinite; }
  .animate-moodLoop .mouth-sad { animation: mouthSad 1.35s ease-in-out infinite; }
  .animate-moodLoop .tear { animation: tearShow 1.35s ease-in-out infinite; }

  .group:hover .icon-moodLoop .mouth-happy { animation: mouthHappy 1.35s ease-in-out infinite; }
  .group:hover .icon-moodLoop .mouth-neutral { animation: mouthNeutral 1.35s ease-in-out infinite; }
  .group:hover .icon-moodLoop .mouth-sad { animation: mouthSad 1.35s ease-in-out infinite; }
  .group:hover .icon-moodLoop .tear { animation: tearShow 1.35s ease-in-out infinite; }
`;

const SentimentIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <style>{sentimentIconStyles}</style>
      {/* base face */}
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="0.75" fill="currentColor" stroke="none" />
      </g>

      {/* mouths (crossfade via CSS) */}
      <g className="mouth mouth-happy" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8.8 14.2c.9 1.2 2 1.8 3.2 1.8s2.3-.6 3.2-1.8" />
      </g>

      <g className="mouth mouth-neutral" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="9.2" y1="14.4" x2="14.8" y2="14.4" />
      </g>

      <g className="mouth mouth-sad" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8.9 15.8c.9-1.1 2-1.6 3.1-1.6s2.2.5 3.1 1.6" />
      </g>

      {/* optional tear (fade in at sad phase) */}
      <path className="tear" d="M16.2 12.2c.6.7.6 1.5 0 2.2-.6-.7-.6-1.5 0-2.2z" fill="currentColor" opacity="0" />
    </svg>
  );
};

export default SentimentIcon;
