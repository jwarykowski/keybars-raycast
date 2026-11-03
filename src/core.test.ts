import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import { candidates, findCommand, focusArgs, menuTitle, NotInstalled, parseStatus, run } from "./core.ts";

test("keybars-pro is looked for where the app installs it", () => {
  assert.deepEqual(candidates(undefined, "/Users/me"), [
    "/usr/local/bin/keybars-pro",
    "/Users/me/.local/bin/keybars-pro",
    "/opt/homebrew/bin/keybars-pro",
    "/Applications/keybars Pro.app/Contents/MacOS/keybars-pro-cli",
  ]);
  assert.equal(candidates(" ~/bin/kp ", "/Users/me")[0], "/Users/me/bin/kp");
  const there = new Set(["/Users/me/.local/bin/keybars-pro"]);
  assert.equal(
    findCommand("", (p) => there.has(String(p)), "/Users/me"),
    "/Users/me/.local/bin/keybars-pro",
  );
  assert.equal(
    findCommand(undefined, () => false, "/Users/me"),
    undefined,
  );
});

test("status reads what it needs, with defaults", () => {
  const s = parseStatus('{"on":true,"plays":"ambient","focus":{"phase":"work","remaining":690,"length":1500},"x":1}');
  assert.deepEqual(s, { on: true, plays: "ambient", focus: { phase: "work", remaining: 690, length: 1500 } });
  assert.deepEqual(parseStatus("{}"), { on: false, plays: "music", focus: { phase: "", remaining: 0, length: 0 } });
});

test("the menu bar shows Focus while it runs", () => {
  assert.equal(menuTitle(undefined), "");
  assert.equal(menuTitle(parseStatus("{}")), "");
  assert.equal(menuTitle(parseStatus('{"focus":{"phase":"work","remaining":690}}')), "🎯 12m");
  assert.equal(menuTitle(parseStatus('{"focus":{"phase":"break","remaining":30}}')), "☕ 1m");
});

test("Focus takes minutes, or the app's length", () => {
  assert.deepEqual(focusArgs(undefined), ["focus", "start"]);
  assert.deepEqual(focusArgs(" "), ["focus", "start"]);
  assert.deepEqual(focusArgs("25"), ["focus", "start", "25m"]);
  assert.deepEqual(focusArgs("50m"), ["focus", "start", "50m"]);
  assert.throws(() => focusArgs("soon"), /isn't a number/);
  assert.throws(() => focusArgs("0"), /isn't a number/);
});

const dir = mkdtempSync(join(tmpdir(), "keybars-raycast-"));
after(() => rmSync(dir, { recursive: true, force: true }));

test("run gives keybars-pro's output, or its last error line", async () => {
  const fake = join(dir, "keybars-pro");
  writeFileSync(
    fake,
    '#!/bin/sh\nif [ "$1" = status ]; then echo \'{"on":true}\'; exit 0; fi\necho "usage: ..." >&2\necho "keybars-pro: keybars Pro isn\'t running" >&2\nexit 3\n',
  );
  chmodSync(fake, 0o755);
  assert.equal((await run(fake, ["status", "-json"])).trim(), '{"on":true}');
  await assert.rejects(run(fake, ["toggle"]), /^Error: keybars Pro isn't running$/);
  await assert.rejects(run(undefined, ["toggle"]), NotInstalled);
});
