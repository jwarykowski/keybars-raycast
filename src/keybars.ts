// keybars-pro from Raycast: the command, found once, and failures as toasts.
import { getPreferenceValues, showHUD, showToast, Toast } from "@raycast/api";

import { findCommand, run } from "./core.ts";

const command = () => findCommand(getPreferenceValues<{ command?: string }>().command);

export function keybars(args: string[]): Promise<string> {
  return run(command(), args);
}

/** Runs a no-view command: a HUD when it worked, a toast saying why when it didn't. */
export async function act(args: string[], done: string): Promise<void> {
  try {
    await keybars(args);
    await showHUD(done);
  } catch (err) {
    await failed(err);
  }
}

export async function failed(err: unknown): Promise<void> {
  await showToast({
    style: Toast.Style.Failure,
    title: "keybars",
    message: err instanceof Error ? err.message : String(err),
  });
}
