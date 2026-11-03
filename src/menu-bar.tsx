import { Icon, MenuBarExtra } from "@raycast/api";
import { useEffect, useState } from "react";

import { focusing, menuTitle, modes, parseStatus, type Status } from "./core.ts";
import { failed, keybars } from "./keybars.ts";

export default function Command() {
  const [status, setStatus] = useState<Status>();
  const [loading, setLoading] = useState(true);

  // the menu bar asks again every minute (the command's interval)
  useEffect(() => {
    keybars(["status", "-json"])
      .then((out) => setStatus(parseStatus(out)))
      .catch(() => setStatus(undefined))
      .finally(() => setLoading(false));
  }, []);

  const run = (args: string[]) => () => keybars(args).catch(failed);
  const title = menuTitle(status);

  return (
    <MenuBarExtra
      icon={{ source: "menubar.png", tintColor: { light: "#000000", dark: "#ffffff" } }}
      title={title || undefined}
      isLoading={loading}
      tooltip="keybars Pro"
    >
      {status ? (
        <>
          <MenuBarExtra.Section>
            {focusing(status) ? (
              <MenuBarExtra.Item title="Stop Focus" icon={Icon.Stop} onAction={run(["focus", "stop"])} />
            ) : (
              <MenuBarExtra.Item title="Start Focus" icon={Icon.Clock} onAction={run(["focus", "start"])} />
            )}
            <MenuBarExtra.Item
              title={status.on ? "Lights off" : "Lights on"}
              icon={Icon.LightBulb}
              onAction={run([status.on ? "off" : "on"])}
            />
          </MenuBarExtra.Section>
          <MenuBarExtra.Section title="Play">
            {modes.map((m) => (
              <MenuBarExtra.Item
                key={m.id}
                title={m.title}
                icon={m.id === status.plays ? Icon.CheckCircle : Icon.Circle}
                onAction={run(["play", m.id])}
              />
            ))}
          </MenuBarExtra.Section>
        </>
      ) : (
        <MenuBarExtra.Item title="keybars Pro isn't running" />
      )}
    </MenuBarExtra>
  );
}
