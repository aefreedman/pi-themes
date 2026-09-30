# Changelog

## Unreleased

### Fixed

- Keep release success tied to source validation and `npm publish`, not the registry's eventual post-publish visibility; retain the fail-closed pre-publish identity check.

## 0.2.2 - 2026-09-29

### Changed

- Declare explicit dark/light appearance for the Solarized themes, preserving both palettes.
- Bind release publication and retries to the immutable tag, version, and source commit, with pre-publication validation and post-publication identity checks.
- Automatically publish stable GitHub releases through trusted npm publishing while retaining immutable-tag manual recovery.

## 0.2.1 - 2026-08-29

### Changed

- Improved text, comment, selection, and thinking-level contrast in both Solarized themes.
- Added explicit scrollbar, search highlight, and maximum-thinking colors.

## 0.2.0 - 2026-08-29

### Added

- Solarized Light theme for Pi.

## 0.1.0 - 2026-08-06

### Added

- Solarized Dark theme for Pi.
