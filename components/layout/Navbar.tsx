"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { streamers } from "@/data/streamers";
import { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/games" },
  { label: "Streamers", href: "/streamers" },
  { label: "Community", href: "/community" },
  { label: "Clips", href: "#" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasLiveStreamers = streamers.some((s) => s.isLive);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(8,11,18,0.85)] backdrop-blur-[12px] border-b border-exile-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-24 h-16 md:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 shrink-0">
          <span className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-white">
            GAMERS
          </span>
          <span className="font-display font-bold text-xl sm:text-2xl uppercase tracking-wider text-exile-accent glow-accent">
            EXILE
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-sm text-exile-muted hover:text-exile-text transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-exile-accent group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Right side: CTA + live indicator */}
        <div className="hidden md:flex items-center gap-4">
          {hasLiveStreamers && (
            <div className="flex items-center gap-2 text-exile-red font-mono text-xs uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-exile-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-exile-red" />
              </span>
              Live
            </div>
          )}
          <Button variant="primary" href="#">
            Join Discord
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-exile-text p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 top-16 bg-exile-bg/98 backdrop-blur-md z-40 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="font-display font-bold text-3xl uppercase tracking-widest text-exile-text hover:text-exile-accent transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
              >
                <Button variant="primary" href="#">
                  Join Discord
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
