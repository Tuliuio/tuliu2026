interface LeafDecorationProps {
  className?: string;
  flip?: boolean;
}

const LeafDecoration = ({ className = "", flip = false }: LeafDecorationProps) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* Main branch */}
      <path
        d="M100 190 C100 140, 90 100, 70 60 C60 40, 55 20, 60 10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* Leaves on right side */}
      <ellipse cx="90" cy="50" rx="25" ry="12" transform="rotate(-30 90 50)" fill="currentColor" opacity="0.15" />
      <ellipse cx="100" cy="80" rx="28" ry="13" transform="rotate(-20 100 80)" fill="currentColor" opacity="0.12" />
      <ellipse cx="105" cy="110" rx="26" ry="12" transform="rotate(-15 105 110)" fill="currentColor" opacity="0.1" />
      <ellipse cx="108" cy="140" rx="24" ry="11" transform="rotate(-10 108 140)" fill="currentColor" opacity="0.08" />
      {/* Leaves on left side */}
      <ellipse cx="65" cy="65" rx="22" ry="10" transform="rotate(25 65 65)" fill="currentColor" opacity="0.13" />
      <ellipse cx="72" cy="95" rx="24" ry="11" transform="rotate(20 72 95)" fill="currentColor" opacity="0.11" />
      <ellipse cx="78" cy="125" rx="22" ry="10" transform="rotate(15 78 125)" fill="currentColor" opacity="0.09" />
      <ellipse cx="85" cy="155" rx="20" ry="9" transform="rotate(10 85 155)" fill="currentColor" opacity="0.07" />
      {/* Secondary branch */}
      <path
        d="M100 190 C105 150, 115 120, 130 80 C140 60, 145 40, 140 25"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <ellipse cx="125" cy="60" rx="20" ry="9" transform="rotate(-35 125 60)" fill="currentColor" opacity="0.1" />
      <ellipse cx="130" cy="90" rx="22" ry="10" transform="rotate(-25 130 90)" fill="currentColor" opacity="0.08" />
    </svg>
  );
};

export default LeafDecoration;
