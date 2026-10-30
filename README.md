# FORM

FORM is a focused daily home-training Android app with a fixed weekly routine, guided exercises, workout timers, local history, streaks, and daily reminders. The complete interface and exercise images are bundled in the APK, so normal use does not require an internet connection.

**Official release:** [FORM v1.0 — Official Release](https://github.com/Harsha240105/FrOm/releases/tag/v1.0)

## Contents

- [Features](#features)
- [Offline operation](#offline-operation)
- [Release and app details](#release-and-app-details)
- [Installation](#installation)
- [Build from source](#build-from-source)
- [Signing and security](#signing-and-security)
- [Testing](#testing)
- [Links](#links)

## Features

### Training

- Daily training plan with a 4:00 AM training-day reset.
- Fixed weekly routine covering Strength A, Strength B, walking/mobility, stamina/balance, and recovery days.
- Guided exercise cards with bundled demonstration images, instructions, targets, and rest times.
- Rep counting for repetition-based exercises.
- Exercise timers and timed rest periods with sound and vibration cues.
- Session summary with start time, end time, duration, and completed exercise count.

### Tracking and reminders

- Local workout history with session and per-exercise timestamps.
- Daily streak tracking and a monthly calendar view.
- JSON export of workout history.
- User-scheduled local notifications for the 4:00 AM wake-up and 5:00 AM workout reminder.
- In-app wake/workout reminders with a 10-minute snooze option.
- Monochrome, mobile-first interface designed for phone use.

## Offline operation

FORM works without an internet connection during normal use. The HTML, JavaScript, CSS, icons, and exercise images are packaged inside the APK. Workouts, timers, history, streaks, and scheduled local notifications work with the device offline, including in airplane mode.

Photo-credit links are optional and open external sources in a browser. Internet access is required only if you choose to open one of those links.

## Release and app details

| Item | Value |
| --- | --- |
| App name | FORM |
| Package ID | `com.harsha.form` |
| Version | 1.0 |
| Version code | 1 |
| Minimum Android | 5.1 (API 22) |
| Target SDK | 34 (Android 14) |
| Compile SDK | 34 |
| Capacitor | 6.2.3 |
| Local Notifications plugin | 6.1.3 |
| Release title | FORM v1.0 — Official Release |
| Release tag | `v1.0` |
| Target branch | `main` |
| Release status | Latest official release, not a pre-release |
| Release APK | [FORM-v1.0-release.apk](https://github.com/Harsha240105/FrOm/releases/download/v1.0/FORM-v1.0-release.apk) |
| APK size | 2,094,449 bytes |
| SHA-256 | See [SHA-256 verification](#sha-256-verification) |

## Installation

### Requirements

- Android 5.1 (API 22) or newer.
- Notification permission on Android 13 and newer.
- Exact-alarm permission on devices or Android versions that require it for scheduled reminders.

### SHA-256 verification

Download `FORM-v1.0-release.apk` from the [official v1.0 release](https://github.com/Harsha240105/FrOm/releases/tag/v1.0), then verify it in PowerShell:

```powershell
Get-FileHash -Algorithm SHA256 .\FORM-v1.0-release.apk
```

The complete SHA-256 must be:

```text
07DB03127B639711A4A2A1F815E94826C16BB7087451642DA7E2B11D7CEF755E
```

Do not install the APK if the computed hash does not match exactly.

### Install on Android

1. Download and verify `FORM-v1.0-release.apk`.
2. Allow installation from the file manager or browser used to open the APK.
3. Install the APK and open FORM.
4. Allow notification access when prompted.
5. Open the **ALARM** screen to enable reminders. Allow exact alarms if Android requests it.

### Install with ADB

```powershell
adb install -r .\FORM-v1.0-release.apk
```

The release APK uses a different signing key from the debug build. If a debug build is already installed, uninstall it first:

```powershell
adb uninstall com.harsha.form
adb install .\FORM-v1.0-release.apk
```

## Build from source

### Requirements

- Node.js and npm.
- JDK 17.
- Android SDK with API 34 and the matching build tools.
- `ANDROID_HOME` or `ANDROID_SDK_ROOT` pointing to the Android SDK.

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

Create `android\keystore.properties` locally. Use your own signing values and never commit this file:

```properties
storeFile=C:/path/to/your-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

Then build:

```powershell
Set-Location android
.\gradlew.bat assembleRelease
```

Output:

```text
android\app\build\outputs\apk\release\app-release.apk
```

The release build enables R8 minification and resource shrinking.

## Signing and security

The published v1.0 APK was verified with the Android SDK `apksigner` tool:

| Check | Result |
| --- | --- |
| APK Signature Scheme v1 (JAR signing) | Verified |
| APK Signature Scheme v2 | Verified |
| Number of signers | 1 |
| Signer certificate DN | `CN=FORM, OU=Android, O=FORM, L=Private, ST=Private, C=IN` |
| Signer certificate SHA-256 | `a5cd73c6c33f33eff4050ebef75aea7044ae817f92802e714589b98f6dbb1d84` |
| Key algorithm | RSA 4096-bit |

Verify the downloaded APK signature with Android SDK build tools:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\34.0.0\apksigner.bat" verify --verbose --print-certs .\FORM-v1.0-release.apk
```

Signing security:

- The keystore, `keystore.properties`, passwords, and signing credentials are not included in this repository.
- Signing secrets are excluded by `.gitignore`.
- The release APK is distributed as a GitHub Release asset and is not committed to the source repository.

## Testing

### Manual verification

1. Launch FORM and confirm the home screen shows the current day, weekly plan, 4:00 AM wake-up, 5:00 AM workout, and 5:30 AM finish times.
2. Select **START TODAY'S WORKOUT** and confirm each exercise card shows its image, instructions, target, and rest time.
3. For a repetition exercise, use `+` and `-` to count repetitions, then complete the set.
4. For a timed exercise, start the timer, let it finish, and complete the exercise.
5. Let the rest timer finish and confirm the next exercise becomes available.
6. Complete the session and confirm the summary and history entry.
7. Force-stop and relaunch FORM, then confirm the workout history remains.
8. Enable airplane mode and repeat the checks; all app content should remain available.
9. From the **ALARM** screen, allow notifications and schedule the wake-up and workout reminders.
10. Move the device time across 4:00 AM, from 03:59 to 04:00, and confirm FORM starts the new training day.

### Verified v1.0 results

The release APK was installed and tested on an Android 16 (API 36.1) emulator with networking disabled:

- The home screen, weekly plan, exercise cards, and bundled exercise images loaded offline.
- The 4:00 AM reset returned the previous training day at 03:59 and the current training day at 04:00.
- Exercise completion, rep counting, exercise timers, and rest timers worked.
- Workout records persisted after force-stop and relaunch.
- Wake-up and workout notifications were scheduled with IDs `4001` (4:00 AM) and `5001` (5:00 AM), repeating daily.
- The APK verified with signature schemes v1 and v2.
- WebView debugging is disabled in the release build, and no WebView DevTools socket was exposed.

## Links

- **Repository:** https://github.com/Harsha240105/FrOm
- **Official release:** https://github.com/Harsha240105/FrOm/releases/tag/v1.0
- **APK download:** https://github.com/Harsha240105/FrOm/releases/download/v1.0/FORM-v1.0-release.apk
- **Latest release:** https://github.com/Harsha240105/FrOm/releases/latest
