import { Action, ActionPanel, Icon, List, popToRoot, showHUD } from "@raycast/api";
import { useEffect, useState } from "react";

import { modes, parseStatus } from "./core.ts";
import { failed, keybars } from "./keybars.ts";

export default function Command() {
  const [plays, setPlays] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    keybars(["status", "-json"])
      .then((out) => setPlays(parseStatus(out).plays))
      .catch(failed)
      .finally(() => setLoading(false));
  }, []);

  async function play(id: string, title: string) {
    try {
      await keybars(["play", id]);
      await showHUD(`Playing ${title}`);
      await popToRoot();
    } catch (err) {
      await failed(err);
    }
  }

  return (
    <List isLoading={loading} searchBarPlaceholder="What the keyboard plays">
      {modes.map((m) => (
        <List.Item
          key={m.id}
          title={m.title}
          subtitle={m.subtitle}
          icon={m.id === plays ? Icon.CheckCircle : Icon.Circle}
          accessories={m.id === plays ? [{ text: "playing" }] : []}
          actions={
            <ActionPanel>
              <Action title={`Play ${m.title}`} icon={Icon.Play} onAction={() => play(m.id, m.title)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
