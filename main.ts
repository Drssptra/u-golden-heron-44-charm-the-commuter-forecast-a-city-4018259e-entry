// Mizzlewick forecast — assembled from named parts, then validated
// against the competition gate (1–140 chars, one line, non-blank)
// before being written as raw bytes with no trailing newline.

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type ForecastParts = {
  city: string;
  sky: string[];
  twist: string;
};

const PARTS: ForecastParts = {
  city: "Mizzlewick",
  sky: ["drizzle all morning", "sunshine by noon"],
  twist:
    "the station cat has claimed your seat, so arrive early and bring biscuits as tribute",
};

const EM_DASH = "—";
const GATE_MIN = 1;
const GATE_MAX = 140;

class Forecast {
  static build(parts: ForecastParts): string {
    const weather = parts.sky.join(", ");
    return `${parts.city}: ${weather} ${EM_DASH} ${parts.twist}.`;
  }

  static checkGate(text: string): void {
    const problems: string[] = [];
    if (text.length < GATE_MIN || text.length > GATE_MAX) {
      problems.push(`length ${text.length} outside ${GATE_MIN}-${GATE_MAX}`);
    }
    if (text.trim().length === 0) problems.push("blank text");
    if (text.includes("\n") || text.includes("\r")) {
      problems.push("must be a single line");
    }
    if (text.endsWith("\n") || text !== text.trim()) {
      problems.push("must not carry leading/trailing whitespace");
    }
    if (new TextEncoder().encode(text).length !== text.length) {
      // Em dash is multi-byte UTF-8; record the byte size so a later
      // byte-based tie-break is never confused with the char count.
      console.error(
        `Note: entry is ${text.length} chars / ${new TextEncoder().encode(text).length} bytes.`,
      );
    }
    if (problems.length > 0) {
      throw new Error(`Gate failed: ${problems.join("; ")}`);
    }
  }
}

async function main(): Promise<void> {
  const entry = Forecast.build(PARTS);
  Forecast.checkGate(entry);

  const dir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "entry.txt"), new TextEncoder().encode(entry));
  process.stdout.write(entry + "\n");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
