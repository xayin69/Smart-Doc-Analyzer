type IconProps = { className?: string };

const summarizeIconStyles = `
  .note-line {
    stroke-dasharray: 18;
    stroke-dashoffset: 18;
  }

  @keyframes noteLoop {
    0% { stroke-dashoffset: 18; opacity: 0.25; }
    35% { opacity: 0.95; }
    60% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 18; opacity: 0.25; }
  }

  .animate-noteLoop .note-line { animation: noteLoop 1.05s ease-in-out infinite; }
  .animate-noteLoop .note-line-1 { animation-delay: 0s; }
  .animate-noteLoop .note-line-2 { animation-delay: 0.08s; }
  .animate-noteLoop .note-line-3 { animation-delay: 0.16s; }

  .group:hover .icon-noteLoop .note-line { animation: noteLoop 1.05s ease-in-out infinite; }
  .group:hover .icon-noteLoop .note-line-1 { animation-delay: 0s; }
  .group:hover .icon-noteLoop .note-line-2 { animation-delay: 0.08s; }
  .group:hover .icon-noteLoop .note-line-3 { animation-delay: 0.16s; }
`;

const SummarizeIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <style>{summarizeIconStyles}</style>
      {/* notebook */}
      <rect
        x="5"
        y="3.5"
        width="14"
        height="17"
        rx="2.2"
        className="note-shell"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* spine */}
      <path d="M8 3.8V20.2" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />

      {/* lines (animated) */}
      <line x1="9" y1="8" x2="17" y2="8" className="note-line note-line-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="9" y1="11.3" x2="17" y2="11.3" className="note-line note-line-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="9" y1="14.6" x2="14.8" y2="14.6" className="note-line note-line-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

    </svg>
  );
};

export default SummarizeIcon;
