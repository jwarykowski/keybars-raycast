import { parseStatus } from "./core.ts";
import { act, failed, keybars } from "./keybars.ts";

export default async function Command() {
  try {
    const on = parseStatus(await keybars(["status", "-json"])).on;
    await act(["toggle"], on ? "Keyboard lights off" : "Keyboard lights on");
  } catch (err) {
    await failed(err);
  }
}
