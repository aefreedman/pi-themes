# Pi Themes

Personal Pi theme package for cross-project, machine-global installs.

Current contents:
- `solarized-dark`

## Install

Local development install:

```bash
pi install "<path-to-pi-themes>"
```

Project-local install:

```bash
pi install -l "<path-to-pi-themes>"
```

## Notes

- Pi discovers packaged themes from `themes/`.
- After install, select the theme by name:

```json
{
  "theme": "solarized-dark"
}
```
