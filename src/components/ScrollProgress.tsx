"use client";

import * as m from 'motion/react-m';
import { useScroll, useSpring } from 'motion/react';

/** Thin gradient bar pinned under the header that tracks page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400"
    />
  );
}

export default ScrollProgress;
