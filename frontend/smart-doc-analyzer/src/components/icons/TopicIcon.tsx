type IconProps = { className?: string };

const TopicIcon = ({ className }: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      {/* shelf */}
      <line x1="4" y1="19.2" x2="20" y2="19.2" stroke="currentColor" strokeWidth="1.4" opacity="0.55" strokeLinecap="round" />

      <rect className="book book1" x="4.3" y="7.2" width="4.1" height="11.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect className="book book2" x="9.9" y="5.8" width="4.1" height="12.9" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect className="book book3" x="15.5" y="8.2" width="4.1" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.6" />

      {/* tiny labels */}
      <line x1="5.2" y1="10.2" x2="7.4" y2="10.2" stroke="currentColor" strokeWidth="1.2" opacity="0.55" strokeLinecap="round" />
      <line x1="10.8" y1="9.2" x2="13" y2="9.2" stroke="currentColor" strokeWidth="1.2" opacity="0.55" strokeLinecap="round" />
      <line x1="16.4" y1="11" x2="18.6" y2="11" stroke="currentColor" strokeWidth="1.2" opacity="0.55" strokeLinecap="round" />
    </svg>
  );
};

export default TopicIcon;
