# FORM

FORM is a focused daily home-training Android app with a fixed weekly routine, guided exercises, workout timers, local history, streaks, and secure private photo storage.

The complete interface and exercise images are bundled in the APK, so normal training use does not require an internet connection.

FORM v4.0 is published. Physical-device feature verification remains a user follow-up.

## Contents

- [Features](#features)
- [Offline operation](#offline-operation)
- [Release and app details](#release-and-app-details)
- [Installation](#installation)
- [Build from source](#build-from-source)
- [Signing and security](#signing-and-security)
- [Testing](#testing)
- [Known limitations](#known-limitations)
- [Links](#links)

## Features

### Training

- Daily training plan with a Monday rest/make-up slot and six training days.
- Fixed weekly routine covering strength, mobility, stamina, balance, and recovery days.
- Guided exercise cards with bundled demonstration images, instructions, targets, and rest times.
- Rep counting for repetition-based exercises.
- Exercise timers and timed rest periods with sound and vibration cues.
- Session summary with start time, end time, duration, and completed exercise count.
- Make-up workout support through the Monday slot.

### Tracking

- Local workout history with session and per-exercise timestamps.
- Daily streak tracking and monthly calendar view.
- Three calendar activity states:
  - Black: workout completed.
  - Green: photo saved without a workout.
  - White: neither workout nor photo.
- Historical details show recorded information only; future workouts are planning only and do not create fake history.
- Workout progression is manual across Starter, Medium, and Hard stages.
- JSON history export.

### Calorie burn

- Dedicated Calorie Burn screen with today’s estimate, exercise breakdown, last 14 days, total calories, total active time, and total sessions.
- Transparent MET-based estimate:
  - Rest periods are excluded.
  - Repetition-based exercises use documented duration estimates.
  - Figures remain estimates and are not medical or dietary advice.
- Body weight snapshots protect historical calorie estimates from later weight changes.

### Home, nutrition, and photos

- Home screen shows today’s workout, exercise list, progress, start control, calorie summary, and seven-day upcoming workout cards.
- The Home plan card can be swiped to view today’s plan and the next scheduled training plan.
- Water and protein intake use editable local targets with add/subtract controls and persistence.
- Private Photo Vault uses AES-256-GCM with PBKDF2 password-based key derivation.
- Vault supports direct camera capture, multiple existing-photo selection, preview before encryption, and encrypted local storage.
- No plaintext photos are stored in the Gallery, cloud storage, or app logs.

### Backup and restore

- Encrypted local backup using Android Storage Access Framework.
- Backup includes workout history, profile, settings, calendar data, water/protein data, and encrypted vault files.
- Backup uses AES-256-GCM with PBKDF2 key derivation, integrity checks, versioned format, and validation before restore.

### Spotify

- Optional Spotify integration through the official App Remote plugin.
- Optional local music playback from multiple selected audio files or an Android-selected music folder.
- Local music is played in place and is not copied into FORM.
- Native Client ID validation requires exactly 32 hexadecimal characters.
- Release builds fail configuration validation when the Client ID is missing or invalid.

### Alarm removal

- FORM no longer schedules or runs the removed 4:00 AM wake-up and 5:00 AM workout alarms.
- Workout timers, rest timers, exercise sounds, and history remain intact.
- The obsolete native alarm bridge was removed; only unrelated local notifications cleanup remains supported by the installed dependency.

## Offline operation

FORM works offline during normal use. HTML, JavaScript, CSS, icons, and exercise images are packaged inside the APK.

Workout timers, rest timers, history, streaks, water/protein data, and the private vault work offline. Encrypted backups remain local through the Android Storage Access Framework.

Photo-credit links are optional and open external sources in a browser.

## Release and app details

| Item | Value |
| --- | --- |
| App name | FORM |
| Package ID | `com.harsha.form` |
| Version | 4.0 |
| Version code | 4 |
| Minimum Android | 5.1 (API 22) |
| Target SDK | 34 (Android 14) |
| Compile SDK | 34 |
| Capacitor | 6.2.3 |
| Release title | FORM v4.0 |
| Release tag | `v4.0` |
| Release status | Published |

The release APK must be named separately from the preserved v3.0 asset:

```text
dist/FORM-v4.0-release.apk
```

The v3.0 release asset remains:

```text
dist/FORM-v3.0-release.apk
```

## Installation

### Requirements

- Android 5.1 (API 22) or newer.
- Spotify installed and signed in for Spotify features; Spotify is optional.

### Install on Android

1. Download and verify the v4.0 release APK.
2. Allow installation from the file manager or browser used to open the APK.
3. Install the APK and open FORM.

### Install with ADB

```powershell
adb install -r .\dist\FORM-v4.0-release.apk
```

Do not clear application data or uninstall an existing FORM installation before validating the upgrade path.

## Build from source

### Requirements

- Node.js and npm.
- JDK 17.
- Android SDK with API 34 and matching build tools.

### Prepare the project

```powershell
git clone https://github.com/Harsha240105/FrOm.git
Set-Location FrOm
npm install
npx cap sync android
```

### Build a debug APK

```powershell
npm run build:apk
```

Output:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

### Build a signed release APK

Create `android/keystore.properties` locally. Use the existing signing identity and never commit this file:

```properties
storeFile=C:/path/to/your-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

Build:

```powershell
Set-Location android
.\gradlew.bat assembleRelease
```

Output:

```text
android\app\build\outputs\apk\release\app-release.apk
```

The release build enables R8 minification and resource shrinking.

The release task also validates `FORM_SPOTIFY_CLIENT_ID`:

- It must be present.
- It must contain exactly 32 hexadecimal characters.
- The value is never printed.

## Signing and security

The v4.0 signing identity remains the existing package signing identity.

| Check | Result |
| --- | --- |
| Package ID | `com.harsha.form` |
| Version | 4.0 |
| Version code | 4 |
| Signing status | Verified; matches the preserved v3.0 signing certificate |

Signing security:

- Keystore, credentials, passwords, Spotify secrets, and tokens are not committed.
- The release keystore is not overwritten.
- The verified release APK is included as the `v4.0` release asset.
- Secrets are excluded from logs and source output.

## Testing

### Automated/local checks

- Java compilation: `.\gradlew.bat :app:compileDebugJavaWithJavac`
- JavaScript syntax check: `node --check www/app.js`
- Runnable calorie smoke check: `node tests/form-calorie.test.js`
- Android resource processing through the release compile task.

### Required physical tests before final publication

- Spotify installation, sign-in, authorization, playback, and error states on a physical device.
- Private vault capture, preview, encryption, unlock, view, delete, lock, and background behavior.
- Encrypted backup export, import, corruption rejection, and restore behavior.
- Workout timer, rest timer, session persistence, and history preservation.
- Calorie calculation, weight snapshots, water/protein persistence, and history totals.
- Calendar states and future-plan behavior.
- Upgrade installation with `adb install -r` without data clearing.

Do not mark physical tests complete without running them.

## Known limitations

- Calorie burn is an estimate and excludes rest/normal movement/BMR.
- Spotify remains optional and requires a valid physical-client setup.
- The private vault cannot reset a lost password; backups are required.
- Physical-device feature verification remains pending until the user tests camera capture, local music, calendar history, and vault flows.

## Links

- **Repository:** https://github.com/Harsha240105/FrOm
- **v3.0 release:** https://github.com/Harsha240105/FrOm/releases/tag/v3.0
- **v4.0 release:** https://github.com/Harsha240105/FrOm/releases/tag/v4.0
