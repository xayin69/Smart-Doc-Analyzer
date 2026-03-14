type IconProps = { className?: string };

const translateIconStyles = `
  .lang-a, .lang-b {
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes swapA {
    0%, 20% { transform: translate(0px, 0px) scale(1); opacity: 1; }
    50% { transform: translate(8.3px, 8.8px) scale(0.95); opacity: 0.86; }
    80%, 100% { transform: translate(0px, 0px) scale(1); opacity: 1; }
  }

  @keyframes swapB {
    0%, 20% { transform: translate(0px, 0px) scale(1); opacity: 1; }
    50% { transform: translate(-8.3px, -8.8px) scale(0.95); opacity: 0.86; }
    80%, 100% { transform: translate(0px, 0px) scale(1); opacity: 1; }
  }

  @keyframes langFlow {
    0%, 100% { stroke-dashoffset: 28; opacity: 0.18; }
    50% { stroke-dashoffset: 0; opacity: 0.42; }
  }

  @keyframes langDotPulse {
    0%, 100% { opacity: 0.34; transform: scale(1); }
    50% { opacity: 0.72; transform: scale(1.18); }
  }

  .lang-flow {
    stroke-dasharray: 14;
  }

  .animate-langLoop .lang-a { animation: swapA 1.35s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  .animate-langLoop .lang-b { animation: swapB 1.35s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  .animate-langLoop .lang-flow { animation: langFlow 1.35s ease-in-out infinite; }
  .animate-langLoop .lang-dot { animation: langDotPulse 1.35s ease-in-out infinite; transform-origin: center; }

  .group:hover .icon-langLoop .lang-a { animation: swapA 1.35s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  .group:hover .icon-langLoop .lang-b { animation: swapB 1.35s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
  .group:hover .icon-langLoop .lang-flow { animation: langFlow 1.35s ease-in-out infinite; }
  .group:hover .icon-langLoop .lang-dot { animation: langDotPulse 1.35s ease-in-out infinite; transform-origin: center; }
`;

const TranslateIcon = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{translateIconStyles}</style>
      {/* soft swap track (no arrows) */}
      <path
        className="lang-flow"
        d="M6.2 9.5C8.7 6.9 12.3 6.9 14.8 9.5C17.3 12.1 17.3 15.9 14.8 18.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.32"
      />

      <circle className="lang-dot" cx="6.2" cy="9.5" r="1.05" fill="currentColor" opacity="0.5" />
      <circle className="lang-dot" cx="14.8" cy="18.5" r="1.05" fill="currentColor" opacity="0.5" />

      <text x="5.1" y="10.8" className="lang-a" fill="currentColor" fontSize="7.6" fontWeight="800">
        A
      </text>
      <text x="13.4" y="19.6" className="lang-b" fill="currentColor" fontSize="7.6" fontWeight="800">
        {"\u6587"}
      </text>
    </svg>
  );
};

export default TranslateIcon;
