# FORM

FORM v5.0.1 is a local-first Android home-training application for guided daily
workouts, progress tracking, recovery, nutrition habits, optional music, and
private photo storage. The web interface and exercise assets are bundled into
the APK, so normal training use works offline.

## Features

- Compact Home dashboard with today's workout, progress, streak, calorie estimate, and upcoming plans.
- Guided Workout screen with exercise illustrations, instructions, timers, repetitions, rest periods, and completion tracking.
- Five-destination navigation: Home, Workout, Plan, Progress, and More.
- Weekly Plan calendar with planned, completed, missed, and rest-day states.
- Progress dashboard with streaks, completed sessions, monthly history, programme stage, and manual progression.
- MET-based calorie estimates from completed exercise records only; calories are estimates, not medical or dietary advice.
- Recovery guidance for rest days and the Monday make-up slot. Missed workouts are not doubled up.
- Local water and protein tracking with editable targets.
- Food guidance and a 7–8 hour sleep recommendation.
- Optional Spotify App Remote integration and local music playback where supported.
- AES-256-GCM/PBKDF2 Photo Vault with camera capture, photo selection, preview, unlock, and deletion.
- Encrypted local backup and restore through Android Storage Access Framework.
- Settings for profile, programme, body weight snapshots, music, and local preferences.

## Navigation

The persistent bottom navigation opens:

1. **Home** — compact daily dashboard.
2. **Workout** — today's guided exercise session.
3. **Plan** — weekly routine and scheduled days.
4. **Progress** — streak, history, calories, and programme progress.
5. **More** — Recovery, Nutrition, Music, Photo Vault, Settings, and About FORM.

## Technology

- Capacitor 6.2.3 Android application.
- HTML, CSS, and vanilla JavaScript frontend in `www/`.
- Android native Java plugins for encrypted vault and backup features.
- Android Gradle build with compile/target SDK 34.
- Local browser storage for workout history, profile, settings, nutrition data, and vault metadata.
- Bundled exercise images and fonts for offline use.

## Installation

### Requirements

- Node.js and npm.
- JDK 17 for the documented Android toolchain.
- Android SDK with API 34 and matching build tools.
- Android 5.1/API 22 or newer for installation.

### Prepare and run the web interface

```powershell
git clone https://github.com/Harsha240105/FrOm.git
Set-Location FrOm
npm install
npx cap sync android
python -m http.server 8080 --directory www
```

Open `http://localhost:8080`. Browser mode supports the web UI, but Android-only
features such as Spotify App Remote, camera capture, encrypted native vault
operations, and Android notifications require the APK.

### Build a debug APK

```powershell
npm run build:apk
```

Output:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

Install on a running emulator or connected Android device:

```powershell
adb install -r .\android\app\build\outputs\apk\debug\app-debug.apk
```

### Build a release APK

Create `android/keystore.properties` locally; it is ignored and must never be
committed:

```properties
storeFile=C:/path/to/your-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

Set a valid 32-character hexadecimal Spotify client ID in the same shell when
building either variant:

```powershell
$env:FORM_SPOTIFY_CLIENT_ID = "YOUR_32_CHARACTER_HEX_CLIENT_ID"
Set-Location android
.\gradlew.bat assembleDebug
.\gradlew.bat assembleRelease
```

The release output is `android\app\build\outputs\apk\release\app-release.apk`.
Release signing enables R8 minification and resource shrinking.

Spotify uses Authorization Code with PKCE and the exact redirect URI
`formspotify://callback`. Register that URI in the Spotify Developer Dashboard.
The Android app does not contain or require a Spotify client secret. Spotify
playback controls use the Web API and require a Spotify Premium account with an
active playback device; the rest of FORM remains usable when Spotify is not
configured.

## Project structure

```text
www/                         Web UI, styles, logic, images, and fonts
android/app/src/main/        Android application and native plugins
android/app/build.gradle     Android ID, version, signing, and dependencies
tests/                       Node-based calorie smoke test
dist/                        Preserved release assets
capacitor.config.json        Capacitor configuration
package.json                 npm scripts and dependencies
```

## Data and privacy

FORM stores workout records, profile settings, stage history, water/protein
values, body-weight snapshots, and local preferences on the device. Private
photos are encrypted locally and are not uploaded to cloud storage or copied
to the public Gallery. Backups are encrypted and exported through Android's
local Storage Access Framework.

Spotify is optional and communicates with the installed Spotify application
when the native integration is configured. Photo-credit links and Spotify are
the only features that may open external services. FORM does not require an
account or cloud backend.

Do not clear application data or uninstall the previous app when validating an
upgrade; the app's local data is intended to remain in place.

## Testing

```powershell
node --check .\www\app.js
npm test
npm run build:apk
```

Physical-device verification remains important for camera capture, vault
encryption, Spotify authorization, local music, encrypted backup/restore,
notifications, and upgrade-data preservation.

The calorie smoke test currently exposes an existing calculation expectation
mismatch (`42` actual versus `7` expected); this is tracked separately from the
v5.0 UI release work and is not silently claimed as passing.

## Version history

### FORM v5.0

- Complete responsive UI/UX redesign.
- Compact Home dashboard and persistent rounded bottom navigation.
- Dedicated Workout, Plan, Progress, Recovery, Nutrition, Music, Photo Vault,
  Settings, and About screens.
- Responsive mobile spacing and removal of unnecessary Home footer content.
- Improved navigation icons, active states, weekly plan selection, and compact
  streak/calorie cards.
- Existing local workout, vault, nutrition, backup, and music functionality
  preserved.

### FORM v4.0

Published release with the fixed weekly routine, calorie estimates, encrypted
vault and backup workflows.

## Contribution and license

This repository is maintained by Harsha240105. Contributions should preserve
local data compatibility, avoid committing secrets, and include appropriate
validation for behavior changes. No separate open-source license is declared
in this repository; all rights remain with the repository owner unless stated
otherwise.

## Links

- Repository: https://github.com/Harsha240105/FrOm
- v5.0 release: https://github.com/Harsha240105/FrOm/releases/tag/v5.0
- v4.0 release: https://github.com/Harsha240105/FrOm/releases/tag/v4.0
