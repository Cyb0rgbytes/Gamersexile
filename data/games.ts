import { Game } from "@/types";

export const games: Game[] = [
  {
    id: "valorant",
    name: "VALORANT",
    genre: "Tactical FPS",
    developer: "Riot Games",
    players: "22M+",
    description: "5v5 character-based tactical shooter. Every round is a mind game.",
    accentColor: "#FF4655",
    imagePath: "/images/valorant.jpg",
  },
  {
    id: "marvel-rivals",
    name: "Marvel Rivals",
    genre: "Hero Shooter",
    developer: "NetEase Games",
    players: "40M+",
    description: "Marvel's ultimate hero-vs-hero battleground. Assemble or be assembled.",
    accentColor: "#C41C1C",
    imagePath: "/images/marvel-rivals.jpg",
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    genre: "Tactical FPS",
    developer: "Valve",
    players: "1M+ daily",
    description: "The definitive tactical shooter. 20 years of perfection, rebuilt.",
    accentColor: "#F0A500",
    imagePath: "/images/cs2.jpg",
  },
  {
    id: "overwatch2",
    name: "Overwatch 2",
    genre: "Hero Shooter",
    developer: "Blizzard Entertainment",
    players: "35M+",
    description: "Push the payload. Pick your hero. Change the world.",
    accentColor: "#F9A825",
    imagePath: "/images/overwatch2.jpg",
  },
];
