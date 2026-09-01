"use client";

import * as m from 'motion/react-m';
import { useReducedMotion, type Variants } from 'motion/react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Where the element travels from. */
  direction?: Direction;
  delay?: number;
  /** Fraction of the element that must be visible before it plays. */
  amount?: number;
  as?: 'div' | 'section' | 'span' | 'li' | 'article';
}

/**
 * Fades content in the first time it scrolls into view. Motion is skipped
 * entirely (content rendered at its final state) when the visitor asked for
 * reduced motion.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  amount = 0.2,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = m[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const { x, y } = OFFSET[direction];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/** Parent that releases its `revealChild` descendants one after another. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const revealChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default Reveal;
