// Forecast for Brindlewick, a city that does not exist.
// Writes one line of weather to $MAKEFUN_OUTPUT_DIR/entry.txt
// (default /output/entry.txt) with no trailing newline,
// and prints the same line plus a newline to stdout.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FORECAST =
  "Brindlewick: drizzle till 9, sunshine by 10, and the 7:42 bus is only eleven minutes late — the driver waved, so you're basically royalty.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), FORECAST, "utf8");
process.stdout.write(`${FORECAST}\n`);
