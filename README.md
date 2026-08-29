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

## Attribution

The `solarized-dark` and `solarized-light` themes adapt the Solarized color palette created by Ethan Schoonover. See `NOTICE.md`.

## License

MIT. See `LICENSE`.
