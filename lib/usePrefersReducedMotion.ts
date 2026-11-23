"use client";

import { useSyncExternalStore } from "react";

/**
 * prefers-reduced-motion.
 *
 * Two hooks, because the distinction matters for hydration:
 *
 *   usePrefersReducedMotion()      — live value, correct from the first client
 *     render. Safe for deciding *animation* (a className, an inline style, a
 *     transition duration) because the markup SHAPE stays identical either way.
 *
 *   useReducedMotionAfterMount()   — same value, but always false until after
 *     hydration. Use it when the preference changes the DOM STRUCTURE (different
 *     element types, a different subtree). The server cannot know the
 *     preference, so branching structure on the live value throws a hydration
 *     mismatch; deferring the flip to an effect means both trees agree on the
 *     first pass and the swap lands one frame later.
 *
 * Framer's own useReducedMotion can report null for a beat before the query
 * resolves. That is fine for a fade and not fine for deciding whether Lenis
 * mounts at all — a flash of smooth scrolling is exactly what a motion
 * sensitive user asked not to get.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/**
 * false during SSR and the hydration pass, true on every client render after.
 * useSyncExternalStore with a different server snapshot is React's own way of
 * expressing this — no setState-in-effect, no extra render cascade.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function useReducedMotionAfterMount(): boolean {
  const live = usePrefersReducedMotion();
  // Only true after hydration, so the first committed tree matches the HTML.
  return useHydrated() && live;
}
