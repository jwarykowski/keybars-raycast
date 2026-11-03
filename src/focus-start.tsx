import type { LaunchProps } from "@raycast/api";

import { focusArgs } from "./core.ts";
import { act, failed } from "./keybars.ts";

export default async function Command(props: LaunchProps<{ arguments: { minutes?: string } }>) {
  let args: string[];
  try {
    args = focusArgs(props.arguments.minutes);
  } catch (err) {
    await failed(err);
    return;
  }
  await act(args, "🎯 Focus started");
}
