# Changelog

## FORM v7.0

### Added

- Fixed weekly plan with Monday rest and the same Tuesday–Sunday routine every week.
- Active-session schema with `sessionId`, `exerciseId`, `day`, `weekStart`, `planKey`, `positionIndex`, timer fields, and restoration state.
- Home Continue and exercise-card Continue flows that preserve the current unfinished exercise.
- Playwright end-to-end tests with screenshots, traces, videos, console-error capture, and failed-request capture.

### Changed

- Calorie history and monthly totals now use the stored calendar plan for stable snapshots.
- Home and live status no longer create records or use time-of-day gating.
- Updated Android version to 7.0/version code 9.

### Removed

- Stages, make-up sessions, daily guide switching, swipeable Home plan cards, and time-window gating.
- Spotify, local music, native music plugins, music settings, music tests, and build validation.

### Fixed

- Interrupted sessions no longer disappear after leaving the workout, refreshing, or crossing into the next day.
- Repeated Continue clicks keep one session and reopen the same unfinished exercise.

## FORM v6.0

### Changed

- Updated Android version to 6.0/version code 8.
- Added cross-platform `npm run build:android` and `npm run verify` commands.
- Added repeatable GitHub Actions release workflow with signature verification.

## FORM v5.0.2

### Changed

- Updated application version to 5.0.2/version code 7.

## FORM v5.0.1

### Fixed

- Corrected calorie test fixtures and rejected invalid exercise logs.
- Calorie estimates now require a completed workout record.

### Security and release

- Updated npm dependency overrides for patched transitive dependencies.
- Updated Android version to 5.0.1/version code 6.

## FORM v5.0

### Added

- Dedicated Home, Workout, Plan, Progress, Recovery, Nutrition, Photo Vault, Settings, and About screens.
- Persistent rounded bottom navigation with responsive active states.
- Compact streak and calorie estimate cards and selectable upcoming plan cards.

### Changed

- Redesigned the dashboard for small Android screens with compact spacing and no unnecessary Home footer.
- Preserved existing local workout history, nutrition values, vault data, and backup data.
- Updated application version to 5.0/version code 5.

## FORM v4.0

### Added

- Dedicated Calorie Burn screen with daily estimate, exercise breakdown, last 14 days, cumulative total, active time, and session totals.
- Workout progress display on the home screen.
- Water and protein targets and intake tracking.
- Private Photo Vault with camera capture, preview, AES-256-GCM encryption, PBKDF2 key derivation, lock/unlock, view, and delete.
- Encrypted local backup with Android Storage Access Framework, integrity validation, and restore protection.

### Changed

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

- JavaScript unit tests and Playwright end-to-end tests pass locally.
- Physical-device vault, backup/restore, lifecycle, and upgrade tests remain pending.
- No penetration test was completed; manual source review and local checks do not certify security.
