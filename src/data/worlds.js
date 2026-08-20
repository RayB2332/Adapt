import { F } from './theme.js';

// World themes — each engine is a different place
export const WORLDS = {
  cosmic: { role:"Space Cadet", roleEmoji:"🚀", hook:"Every right answer powers the rocket!", verb:"BLAST OFF",
    sky:"linear-gradient(180deg,#050818 0%,#0D1230 45%,#1B1464 80%,#2D1B69 100%)", accent:"#7C6CFF", accent2:"#FFD166" },
  grove:  { role:"Gem Keeper", roleEmoji:"🦉", hook:"Catch a magic gem for every right answer!", verb:"START THE HUNT",
    sky:"linear-gradient(180deg,#0A1030 0%,#14205A 40%,#1D3A6E 75%,#274B63 100%)", accent:"#4ADE80", accent2:"#FDE68A" },
  turbo:  { role:"Turbo Racer", roleEmoji:"🏎️", hook:"Right answers make your kart go faster!", verb:"START YOUR ENGINE",
    sky:"linear-gradient(180deg,#2B1055 0%,#7A2E6F 40%,#E85D75 72%,#FFB65C 100%)", accent:"#FF5D73", accent2:"#FFD166" },
  meteor: { role:"Sky Defender", roleEmoji:"🛡️", hook:"Tap the right meteor before it hits the shield!", verb:"DEFEND",
    sky:"linear-gradient(180deg,#1A0B2E 0%,#3B1155 45%,#6B1E63 80%,#93326B 100%)", accent:"#F0ABFC", accent2:"#FFD166" },
  starmap:{ role:"Star Pilot", roleEmoji:"🛸", hook:"Fly planet to planet — answer to jump!", verb:"LAUNCH",
    sky:"radial-gradient(ellipse at 50% 0%,#2D1B69 0%,#120A38 45%,#04030F 100%)", accent:"#60A5FA", accent2:"#F0ABFC" },
};

// Answer tile palette — friendly toy colours + darker "clay" base
export const TILE = [
  { top:"#FF6B81", base:"#D14059", glow:"rgba(255,107,129,0.45)" },
  { top:"#4D9DF7", base:"#2C6FC4", glow:"rgba(77,157,247,0.45)" },
  { top:"#FFB020", base:"#CC7F00", glow:"rgba(255,176,32,0.45)" },
  { top:"#34C77B", base:"#1F9457", glow:"rgba(52,199,123,0.45)" },
];
