// What the extension asks keybars Pro and how it reads the answers, without
// Raycast, so it can be tested on its own.
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/** Where keybars-pro may be: Raycast doesn't see your shell's PATH. */
export function candidates(preferred: string | undefined, home = homedir()): string[] {
  const out = preferred?.trim() ? [preferred.trim().replace(/^~(?=\/)/, home)] : [];
  out.push(
    "/usr/local/bin/keybars-pro",
    join(home, ".local/bin/keybars-pro"),
    "/opt/homebrew/bin/keybars-pro",
    "/Applications/keybars Pro.app/Contents/MacOS/keybars-pro-cli",
  );
  return out;
}

/** The first of them that's there. */
export function findCommand(preferred: string | undefined, exists = existsSync, home = homedir()): string | undefined {
  return candidates(preferred, home).find((p) => exists(p));
}

export class NotInstalled extends Error {
  constructor() {
    super("keybars-pro isn't installed: in keybars Pro, App settings, Command line, Install the command-line tool");
  }
}

/** Runs keybars-pro with args, resolving to what it printed. */
export function run(cmd: string | undefined, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!cmd) {
      reject(new NotInstalled());
      return;
    }
    execFile(cmd, args, { timeout: 10_000 }, (err, stdout, stderr) => {
      if (err) reject(new Error(lastLine(stderr) || err.message));
      else resolve(stdout);
    });
  });
}

function lastLine(s: string): string {
  return (
    s
      .trim()
      .split("\n")
      .at(-1)
      ?.replace(/^keybars-pro: /, "") ?? ""
  );
}

/** The parts of keybars-pro status -json this uses. */
export type Status = {
  on: boolean;
  plays: string;
  focus: { phase: string; remaining: number; length: number };
};

export function parseStatus(json: string): Status {
  const v = JSON.parse(json) as Partial<Status>;
  return {
    on: v.on ?? false,
    plays: v.plays ?? "music",
    focus: { phase: v.focus?.phase ?? "", remaining: v.focus?.remaining ?? 0, length: v.focus?.length ?? 0 },
  };
}

/** What the keyboard can play, in the order the app lists them. */
export const modes = [
  { id: "music", title: "Equaliser", subtitle: "the music on the keys" },
  { id: "ambient", title: "Ambient", subtitle: "a calm scene or a clock" },
  { id: "typing", title: "Typing", subtitle: "the keys you press, and your speed" },
  { id: "cpu", title: "System", subtitle: "each core's load on the bars" },
] as const;

export function focusing(s: Status): boolean {
  return s.focus.phase === "work" || s.focus.phase === "break";
}

/** The menu bar's title: "🎯 12m" while Focus runs, else nothing. */
export function menuTitle(s: Status | undefined): string {
  if (!s || !focusing(s)) return "";
  return `${s.focus.phase === "work" ? "🎯" : "☕"} ${Math.ceil(s.focus.remaining / 60)}m`;
}

/** focus start's arguments for what was typed: "", "25" or "25m". */
export function focusArgs(minutes: string | undefined): string[] {
  const m = minutes?.trim().replace(/m$/, "");
  if (!m) return ["focus", "start"];
  if (!/^\d+$/.test(m) || Number(m) < 1) throw new Error(`"${minutes}" isn't a number of minutes`);
  return ["focus", "start", `${Number(m)}m`];
}
