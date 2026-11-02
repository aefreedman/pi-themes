# Pi Themes

Reusable Pi theme package.

## Contents

- `solarized-dark` - Solarized for dark terminal backgrounds
- `solarized-light` - Solarized for light terminal backgrounds

## Install

From npm:

```bash
pi install npm:@aefree/pi-themes
```

From GitHub:

```bash
pi install git:git@github.com:aefreedman/pi-themes.git
```

Local development install:

```bash
pi install <path-to-pi-themes>
```

Project-local install:

```bash
pi install -l <path-to-pi-themes>
```

## Usage

Pi discovers packaged themes from `themes/`. After installation, select the theme by name in Pi settings:

```json
{
  "theme": "solarized-dark"
}
```

To follow the terminal's detected appearance, start Pi with the paired themes:

```bash
pi --use-theme solarized-light/solarized-dark
```

## Development

Run `npm ci` and `npm test`. Theme contract tests use the exact development Pi version selected in `package.json` and fail if the package-local installed version differs. Validation is offline and uses Pi's shipped strict JSON validator; palette checks remain separate from schema validation. Host resource-loader tests discover an isolated copy of npm's packed file inventory, resolve both palettes, and check invalid-theme diagnostics and reload recovery without user settings or model calls.

`npm pack --dry-run` verifies that only consumer themes, package metadata, and license/attribution documentation ship, not the development runtime or tests.

## Attribution

The `solarized-dark` and `solarized-light` themes adapt the Solarized color palette created by Ethan Schoonover. See `NOTICE.md`.

## License

MIT. See `LICENSE`.
