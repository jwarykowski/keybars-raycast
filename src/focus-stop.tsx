import { act } from "./keybars.ts";

export default async function Command() {
  await act(["focus", "stop"], "Focus stopped");
}
