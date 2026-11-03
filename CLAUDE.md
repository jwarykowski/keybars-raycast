# keybars for Raycast

A Raycast extension (TypeScript, React) that drives keybars Pro through its
`keybars-pro` command: Focus, what the keyboard plays, its lights, and a
menu-bar item. README.md has the detail; this file is what to keep in mind
while working here.

## Commands

- `npm run check` (tsc), `npm run lint` (oxlint), `npm run fmt` (oxfmt;
  never prettier), `npm test` (`node --test`), `npm run build` (`ray
  build`, which runs on Linux too and type-checks against Raycast's API).
- `npm run dev` needs Raycast, so macOS.

## Keep in mind

- Each command in package.json's `commands` is `src/<name>.tsx`.
- Logic goes in `src/core.ts`, which doesn't import Raycast, so the tests
  run under plain Node; the `.tsx` files only render it.
- Raycast doesn't get the shell's PATH: `candidates` in `src/core.ts` is
  where to look for `keybars-pro`, matching where keybars Pro installs it
  (`internal/install` in keybars-pro).
- `author` must be a Raycast Store username before publishing.

## Related repos (in ~/development)

- `keybars-pro`: the app and the `keybars-pro` command (`status -json`,
  `focus`, `play`, `on`, `off`, `toggle`).
