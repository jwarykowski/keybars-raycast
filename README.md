# keybars for Raycast

[keybars Pro](https://keybars.app/pro/) from [Raycast](https://raycast.com)
on macOS:

- **Start Focus** (optionally for a number of minutes) and **Stop Focus**
- **Play**: choose what the keyboard plays, the equaliser, Ambient, Typing
  or System
- **Toggle Keyboard Lights**: keybars Pro's lights on, or the keyboard back
  to its layout
- **keybars in the Menu Bar**: the Focus timer (`🎯 12m`) in the menu bar,
  with Focus, the lights and what's playing a click away

Everything goes through the `keybars-pro` command, so it works on any
keyboard keybars Pro drives.

## requirements

- keybars Pro running, with its command installed: App settings, Command
  line, **Install the command-line tool**
- Raycast on macOS

Raycast doesn't see your shell's PATH, so the extension looks for
`keybars-pro` in `/usr/local/bin`, `~/.local/bin`, `/opt/homebrew/bin` and
inside the app. If yours is elsewhere, set **keybars-pro command** in the
extension's preferences.

## install

Until it's in the Raycast Store:

```sh
git clone https://github.com/jwarykowski/keybars-raycast
cd keybars-raycast
npm ci
npm run dev   # imports it into Raycast; it stays after you stop this
```

## development

```sh
npm run check && npm run lint && npm test
npm run build   # ray build, which also type-checks against Raycast's API
```

The logic (finding the command, reading `keybars-pro status -json`, Focus's
arguments, the menu bar's title) is in `src/core.ts`, tested with
`node --test`; each command file only renders it.

## licence

MIT
