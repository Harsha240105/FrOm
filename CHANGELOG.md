# Changelog

## FORM v7.0

### Fixed

- Spotify playback now discovers available devices and prefers an active,
  non-restricted device.
- Playback controls target the selected device and report actionable Spotify
  API errors without exposing credentials.
- OAuth authorization, device availability, and active playback are shown as
  separate states.

### Changed

- Updated Android version to 7.0/version code 9.

## FORM v6.0

### Changed

- Updated Android version to 6.0/version code 8.
- Spotify Client ID validation now fails builds when configuration is missing,
  invalid, or inconsistent between Gradle property and environment variable.
- Added cross-platform `npm run build:android` and `npm run verify` commands.
- Added repeatable GitHub Actions release workflow with compiled resource and
  signature verification.
- Added runtime build identity diagnostics without exposing the Client ID.

## FORM v5.0.2

### Added

- Spotify Authorization Code with PKCE integration.
- Android deep-link handling for `formspotify://callback`.
- Optional Spotify Web API playback controls without a client secret.

### Changed

- Updated application version to 5.0.2/version code 7.

## FORM v5.0.1

### Fixed

- Corrected calorie test fixtures and rejected invalid exercise logs.
- Calorie estimates now require a completed workout record.

### Security and release

- Updated npm dependency overrides for patched glob, minimatch, rimraf, and tar versions.
- Spotify configuration remains optional; missing credentials no longer block release builds.
- Updated Android version to 5.0.1/version code 6.
- Spotify now uses Authorization Code with PKCE and returns through the
  registered `formspotify://callback` deep link without a client secret.

## FORM v5.0

### Added

- Dedicated Home, Workout, Plan, Progress, Recovery, Nutrition, Music, Photo Vault, Settings, and About screens.
- Persistent rounded bottom navigation with responsive active states.
- Compact streak and calorie estimate cards and selectable upcoming plan cards.

### Changed

- Redesigned the dashboard for small Android screens with compact spacing and no unnecessary Home footer.
- Preserved existing local workout history, nutrition values, stage progression, vault data, backup data, and music behavior.
- Updated application version to 5.0/version code 5.

## FORM v4.0

### Added

- Dedicated Calorie Burn screen with daily estimate, exercise breakdown, last 14 days, cumulative total, active time, and session totals.
- Workout progress display on the home screen.
- Water and protein targets and intake tracking.
- Private Photo Vault with camera capture, preview, AES-256-GCM encryption, PBKDF2 key derivation, lock/unlock, view, and delete.
- Encrypted local backup with Android Storage Access Framework, integrity validation, and restore protection.

### Changed

- Spotify Client ID validation now requires exactly 32 hexadecimal characters and rejects invalid or missing values before release builds.
- Spotify native and JavaScript status handling now preserves authorization failures correctly.
- Body weight snapshots protect historical calorie estimates.
- Calorie calculations now use only logged completed exercise work; rest and normal movement are excluded.

### Removed

- FORM wake-up and 5:00 AM workout reminder scheduling and UI.
- Obsolete native alarm bridge and related localStorage keys.
- Alarm-related Android permissions.

### Fixed

- Java UTF-8 BOM issue in the native vault plugin.
- Vault photo deletion now requires an unlocked vault.
- Vault restore now stages encrypted files before installation.

### Security

- Encrypted vault uses AES-256-GCM and PBKDF2 with strengthened derivation.
- Encrypted backups use AES-256-GCM and PBKDF2 with integrity checks.
- Secrets and passwords are not logged or committed.

### Validation status

- JavaScript calorie smoke test and release Java compilation pass locally.
- Physical-device Spotify, vault, backup/restore, lifecycle, and upgrade tests remain pending.
- Signed release rebuild and final package/signature verification remain pending.
- No penetration test was completed; manual source review and local checks do not certify security.
