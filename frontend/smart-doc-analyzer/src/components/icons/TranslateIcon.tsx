type IconProps = { className?: string };

const TranslateIcon = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
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
