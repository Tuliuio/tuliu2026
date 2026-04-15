import { useEffect, useRef, useState } from "react";

interface ParallaxLeafProps {
  src: string;
  className?: string;
  speed?: number; // parallax intensity
  swayAmount?: number; // horizontal sway in px
}

const ParallaxLeaf = ({ src, className = "", speed = 0.05, swayAmount = 8 }: ParallaxLeafProps) => {
  const ref = useRef<HTMLImageElement>(null);
  const [offset, setOffset] = useState({ y: 0, rotate: 0 });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const distFromCenter = rect.top - viewportCenter;
            const y = distFromCenter * speed;
            const rotate = Math.sin(distFromCenter * 0.003) * swayAmount * 0.5;
            setOffset({ y, rotate });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, swayAmount]);

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      className={`pointer-events-none select-none transition-transform duration-[1200ms] ease-out ${className}`}
      style={{
        transform: `translateY(${offset.y}px) rotate(${offset.rotate}deg)`,
      }}
    />
  );
};

export default ParallaxLeaf;
