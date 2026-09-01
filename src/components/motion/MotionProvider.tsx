"use client";

import { LazyMotion, domAnimation } from 'motion/react';

/**
 * Loads only the DOM animation feature set (~half the size of the full
 * bundle). Every animated component in the storefront uses `m.*` from
 * `motion/react-m`, which is inert until these features are provided.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export default MotionProvider;
