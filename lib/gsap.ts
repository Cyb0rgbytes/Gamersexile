"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* ═══════════════════════════════════════════════════════════════════════════
 *  GSAP — single registration point.
 *
 *  Division of labour (do not blur it):
 *    motion  → small enter/exit animations (Reveal, hero headline stagger)
 *    GSAP    → anything LINKED TO SCROLL POSITION (pins, parallax, scrubs)
 *
 *  Import gsap / ScrollTrigger / useGSAP from here, never from "gsap"
 *  directly, so the plugin is always registered before first use.
 * ═══════════════════════════════════════════════════════════════════════════ */

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
