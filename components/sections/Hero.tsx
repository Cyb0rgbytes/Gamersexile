"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HexGrid } from "@/components/ui/HexGrid";
import { Zap, Play } from "lucide-react";

const headlineWords = ["YOUR", "EXILE", "STARTS", "HERE"];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Layer 1: Nebula gradient animation */}
      <div className="absolute inset-0 nebula-bg" />

      {/* Layer 2: Radial accent glows */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-exile-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-exile-accent-2/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-exile-red/3 rounded-full blur-[150px]" />
      </div>

      {/* Layer 3: HexGrid SVG overlay */}
      <HexGrid />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto">
        {/* Headline: word-by-word reveal */}
        <h1 className="font-display font-bold uppercase tracking-wider leading-tight">
          <span className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            {headlineWords.map((word, i) => (
              <motion.span
                key={word}
                className={
                  word === "EXILE"
                    ? "text-exile-accent glow-accent"
                    : "text-white"
                }
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.12,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          className="font-body text-exile-muted text-base sm:text-lg md:text-xl mt-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
        >
          Where gamers become legends. Streamers build their empire.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
        >
          <Button variant="primary" href="/games" icon={<Zap size={16} />}>
            Enter the Exile
          </Button>
          <Button
            variant="ghost"
            href="/streamers"
            icon={<Play size={16} />}
          >
            Watch Streams
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-5 h-9 border-2 border-exile-border rounded-full flex items-start justify-center p-1.5"
            animate={{ borderColor: ["#1E2A3E", "#00FFB2", "#1E2A3E"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 bg-exile-accent rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
