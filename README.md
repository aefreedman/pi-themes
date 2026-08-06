# Pi Themes

Reusable Pi theme package.

## Contents

- `solarized-dark` - a Pi theme based on the Solarized color palette

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

## Attribution

The `solarized-dark` theme adapts the Solarized color palette created by Ethan Schoonover. See `NOTICE.md`.

## License

MIT. See `LICENSE`.
