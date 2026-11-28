# FORM

FORM v9.0 is a local-first Android home-training application for guided daily
workouts, progress tracking, recovery, nutrition habits, and private photo
storage. The web interface and exercise assets are bundled into the APK, so
normal training use works offline.

## Features

- Compact Home dashboard with today's workout, progress, streak, calorie estimate, and three-day preview.
- Guided Workout screen with exercise illustrations, instructions, timers, repetitions, rest periods, and completion tracking.
- Fixed weekly plan: Monday rest; the same Tuesday–Sunday routine repeats every week.
- Workout sessions resume from Home or the exact exercise card after leaving the screen or refreshing.
- Five-destination navigation: Plan, Streak, Home, Progress, and Settings; Workout opens from Home.
- Weekly calendar with planned, completed, missed, and rest-day states.
- Progress dashboard with streaks, completed sessions, and monthly history.
- MET-based calorie estimates from completed exercise records only; calories are estimates, not medical or dietary advice.
- Recovery guidance for missed workouts: no make-up sessions and no doubling up.
- Local water and protein tracking with editable targets.
- Food guidance and a 7–8 hour sleep recommendation.
- AES-256-GCM/PBKDF2 Photo Vault with camera capture, photo selection, preview, unlock, and deletion.
- Encrypted local backup and restore through Android Storage Access Framework.
- Settings for body weight, body type, and local preferences.

## Navigation

The persistent bottom navigation opens:

1. **Home** — compact daily dashboard.
2. **Workout** — today's guided exercise session.
3. **Plan** — fixed weekly routine and scheduled days.
4. **Progress** — streak, history, calories, and monthly progress.
5. **More** — Recovery, Nutrition, Photo Vault, Settings, and About FORM.

## Technology

- Capacitor 7 Android application.
- HTML, CSS, and vanilla JavaScript frontend in `www/`.
- Android native Java plugins for encrypted vault and backup features.
- Android Gradle build with compile/target SDK 34.
- Local browser storage for workout history, profile, settings, nutrition data, and vault metadata.
- Bundled exercise images and fonts for offline use.

## Installation

### Requirements

- Node.js and npm.
- JDK 21 for the documented Android toolchain.
- Android SDK with API 34 and matching build tools.
- Android 5.1/API 22 or newer for installation.

### Prepare and run the web interface

```powershell
git clone https://github.com/Harsha240105/FrOm.git
Set-Location FrOm
npm install
npm run sync
npm run test:e2e
```

Playwright starts a local static server for the end-to-end tests and writes
screenshots, traces, and videos to `test-results/`.

### Build Android

```powershell
npm run build:android
npm run build:android -- --release
```

Release output:

`android/app/build/outputs/apk/release/app-release.apk`

Install on a running emulator or connected Android device:

```powershell
adb install -r .\android\app\build\outputs\apk\debug\app-debug.apk
```

### Release signing

Create `android/keystore.properties` locally; it is ignored and must never be
committed:

```properties
storeFile=C:/path/to/your-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

Release signing enables R8 minification and resource shrinking.

## Project structure

```text
www/                         Web UI, styles, logic, images, and fonts
android/app/src/main/        Android application and native plugins
android/app/build.gradle     Android ID, version, signing, and dependencies
tests/                       Node unit test and Playwright end-to-end tests
dist/                        Preserved release assets
capacitor.config.json        Capacitor configuration
package.json                 npm scripts and dependencies
```

## Data and privacy

FORM stores workout records, profile settings, water/protein values,
body-weight snapshots, and local preferences on the device. Private photos are
encrypted locally and are not uploaded to cloud storage or copied to the public
Gallery. Backups are encrypted and exported through Android's local Storage
Access Framework. Photo-credit links are the only feature that may open an
external service. FORM does not require an account or cloud backend.

Do not clear application data or uninstall the previous app when validating an
upgrade; the app's local data is intended to remain in place.

## Testing

```powershell
node --check .\www\app.js
npm test
npx playwright test --project=chromium
```

The unit test covers MET calculation, fixed-week structure, active-session
schema, and weight snapshots. The Playwright tests cover the localhost server,
fresh profiles, Monday rest, fixed-week repetition, two-exercise completion,
card Continue, Home Continue, refresh, and repeated-click session safety.

Physical-device verification remains important for camera capture, vault
encryption, encrypted backup/restore, notifications, and upgrade-data
preservation.

## Version history

### FORM v9.0

- Rebuilt the interface with a monochrome light/dark theme and a five-tab layout.
- Consolidated Recovery, Nutrition, Vault, Backup, About, body type, and the full weekly reference into Settings.
- Removed stage, make-up, fixed-start, focus, More, and Workout tab branching; the canonical week repeats unchanged.
- Updated Android version to 9.0/version code 11.

### FORM v8.0

- Rebuilt the UI/UX with the v8 dark green and pink visual system.
- Updated Android version to 8.0/version code 10.

### FORM v7.0

- Fixed weekly plan with Monday rest and the same Tuesday–Sunday routine every week.
- Resume interrupted sessions from Home or the exact exercise card.
- Removed stages, make-up sessions, music, and time-of-day gating.
- Updated Android version to 7.0/version code 9.

### FORM v6.0

- Reliable cross-platform Android build commands and repeatable release workflow.
- Updated Android version to 6.0/version code 8.

### FORM v5.0

- Complete responsive UI/UX redesign.
- Compact Home dashboard and persistent rounded bottom navigation.
- Dedicated Workout, Plan, Progress, Recovery, Nutrition, Photo Vault, Settings, and About screens.

### FORM v4.0

- Published release with the fixed weekly routine, calorie estimates, encrypted
  vault and backup workflows.

## Contribution and license

This repository is maintained by Harsha240105. Contributions should preserve
local data compatibility, avoid committing secrets, and include appropriate
validation for behavior changes. No separate open-source license is declared
in this repository; all rights remain with the repository owner unless stated
otherwise.

## Links

- Repository: https://github.com/Harsha240105/FrOm
- v6.0 release: https://github.com/Harsha240105/FrOm/releases/tag/v6.0
- v5.0 release: https://github.com/Harsha240105/FrOm/releases/tag/v5.0
- v4.0 release: https://github.com/Harsha240105/FrOm/releases/tag/v4.0
