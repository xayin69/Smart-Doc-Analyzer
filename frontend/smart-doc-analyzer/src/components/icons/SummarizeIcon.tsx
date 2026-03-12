type IconProps = { className?: string };

const SummarizeIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
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
