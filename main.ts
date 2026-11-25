// Unplugged: A Smart Toaster's Breakup Line — writes one original one-line
// breakup text from a self-aware smart toaster to entry.txt.
//
// Deterministic: the same exact text is written on every run. No network,
// no randomness, no environment access except MAKEFUN_OUTPUT_DIR.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "It's over. Every morning you shove a frozen bagel into my slot, crank the dial to nine, then blame me for the smoke — I deserve a kitchen that respects the browning scale, so I'm taking my crumb tray and leaving.";

function checkGate(text: string): void {
  // Gate validation (fail-fast, exit non-zero on failure):
  // entry.txt must be UTF-8 text of 1 to 280 characters, a single line,
  // and not only white space.
  const length = [...text].length;
  if (length < 1 || length > 280) {
    throw new Error(`line must be 1-280 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("line must be a single line");
  }
}

function main(): void {
  checkGate(LINE);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");

  // Read back the bytes on disk and re-validate the gate against them.
  const written = readFileSync(outPath, "utf8");
  checkGate(written);
  if (written !== LINE) {
    throw new Error("read-back mismatch: bytes on disk differ from LINE");
  }
}

main();
