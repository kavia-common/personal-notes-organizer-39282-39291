import React, { useMemo } from "react";

/**
 * Decorative spiral rings rendered as SVG along the top.
 */

// PUBLIC_INTERFACE
export default function Rings() {
  /** Create repeated circles along width using viewBox width 1000. */
  const circles = useMemo(() => {
    const items = [];
    const spacing = 16;
    const radius = 6;
    for (let x = 20; x < 1000; x += spacing) {
      items.push(
        <circle key={x} cx={x} cy={13} r={radius} fill="var(--ring-color)" />
      );
    }
    return items;
  }, []);
  return (
    <div className="rings" aria-hidden="true">
      <svg width="100%" height="26" viewBox="0 0 1000 26" preserveAspectRatio="none">
        <defs>
          <filter id="ringShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.6" />
          </filter>
        </defs>
        <g style={{ filter: "url(#ringShadow)" }}>{circles}</g>
      </svg>
    </div>
  );
}
