type IconProps = { className?: string };

const RagIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      {/* doc */}
      <path
        d="M6.2 4.8h7.2l3.4 3.4v10.9c0 1-0.8 1.8-1.8 1.8H6.2c-1 0-1.8-0.8-1.8-1.8V6.6c0-1 0.8-1.8 1.8-1.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path d="M13.4 4.8v3.4h3.4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.9" />

      {/* text lines (wiggle) */}
      <g className="rag-lines" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.95">
        <line x1="6.8" y1="10" x2="12.4" y2="10" className="rag-line rag-line-1" />
        <line x1="6.8" y1="13" x2="11.6" y2="13" className="rag-line rag-line-2" />
        <line x1="6.8" y1="16" x2="10.8" y2="16" className="rag-line rag-line-3" />
      </g>

      {/* scan beam (animate) */}
      <rect x="6.6" y="11.2" width="6.2" height="1.2" rx="0.6" className="rag-beam" fill="currentColor" opacity="0.18" />

      {/* lens (pulse) */}
      <g className="rag-lens" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16.8" cy="14.6" r="3.2" />
        <line x1="19.1" y1="16.9" x2="21" y2="18.8" />
      </g>
    </svg>
  );
};

export default RagIcon;
