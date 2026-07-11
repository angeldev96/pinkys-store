import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribeToMediaQuery(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

const noopSubscribe = () => () => {};

export function useIsMobile() {
  const isMobile = React.useSyncExternalStore(
    (callback) => subscribeToMediaQuery(MOBILE_QUERY, callback),
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );

  const isTouch = React.useSyncExternalStore(
    noopSubscribe,
    () => "ontouchstart" in window || navigator.maxTouchPoints > 0,
    () => false,
  );

  return { isMobile, isTouch };
}

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

function getBreakpoint(): Breakpoint {
  const width = window.innerWidth;
  if (width < 375) return "xs";
  if (width < 480) return "sm";
  if (width < 768) return "md";
  if (width < 1024) return "lg";
  if (width < 1280) return "xl";
  return "2xl";
}

export function useBreakpoint() {
  return React.useSyncExternalStore(subscribeToResize, getBreakpoint, () => "lg" as Breakpoint);
}

export function useMediaQuery(query: string) {
  return React.useSyncExternalStore(
    React.useCallback((callback: () => void) => subscribeToMediaQuery(query, callback), [query]),
    () => window.matchMedia(query).matches,
    () => false,
  );
}
