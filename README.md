# FORM

FORM is a focused daily home-training Android app. It provides a fixed weekly routine, guided exercise cards, rep counting, exercise and rest timers, workout history, streak tracking, and daily wake-up/workout reminders. The Android app is built with Capacitor and packages the complete interface and exercise images inside the APK.

## Features

- Daily training plan with a 4:00 AM training-day reset.
- Weekly routine covering Strength A, Strength B, walking/mobility, stamina/balance, and recovery days.
- Guided exercises with bundled demonstration images, instructions, targets, and rest times.
- Rep counting for repetition-based exercises.
- Exercise timers and automatically timed rest periods with sound and vibration cues.
- Local workout history stored on the device, including session start/end times and per-exercise timestamps.
- Streak tracking and a monthly calendar view.
- JSON export of workout history.
- User-scheduled daily local notifications for the 4:00 AM wake-up and 5:00 AM workout reminder.
- In-app wake/workout reminders with a 10-minute snooze option.
- Monochrome, mobile-first interface designed for phone use.

## Offline functionality

FORM does not require an internet connection during normal use. The HTML, JavaScript, CSS, icons, and exercise images are bundled inside the APK. Workouts, timers, history, streaks, and local notifications work with the device offline (for example, in airplane mode).

External photo-credit links open the original image source in a browser and require internet access only if the user chooses to open them.

## Android installation

### Requirements

- Android 5.1 (API 22) or newer.
- Notification permission on Android 13 and newer.
- Exact-alarm permission if the device/OS requires it for scheduled reminders.

### Verify the APK SHA-256 checksum (PowerShell)

```powershell
Get-FileHash -Algorithm SHA256 .\FORM-v1.0-release.apk
```

Expected SHA-256 for FORM v1.0:

```text
07DB03127B639711A4A2A1F815E94826C16BB7087451642DA7E2B11D7CEF755E
```

### Install

1. Download `FORM-v1.0-release.apk` from the [official v1.0 release](https://github.com/Harsha240105/FrOm/releases/tag/v1.0).
2. Verify the SHA-256 checksum with the command above.
3. Allow installation from the file manager/browser used to open the APK, then install it.
4. Open FORM and allow notification access when prompted.
5. Use the ALARM screen to enable reminders. On Android versions that require exact alarms, allow FORM to schedule exact alarms.

Install with ADB:

```powershell
adb install -r .\FORM-v1.0-release.apk
```

The release APK uses a different signing key from the debug APK. Uninstall any existing debug build before installing the release:

```powershell
adb uninstall com.harsha.form
adb install .\FORM-v1.0-release.apk
```

## App details

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
| Release APK size | 2,094,449 bytes |
| Release APK SHA-256 | `07DB03127B639711A4A2A1F815E94826C16BB7087451642DA7E2B11D7CEF755E` |

## Build instructions

### Requirements

- Node.js and npm.
- JDK 17.
- Android SDK with API 34 and the matching build tools.
- `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) pointing to the Android SDK.

### Install dependencies and sync the Android project

```powershell
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

Create `android\keystore.properties` locally (never commit it):

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

The release build enables R8 minification and resource shrinking. Keep the keystore, `keystore.properties`, passwords, and signing credentials private. They are excluded by `.gitignore`.

## Testing instructions

### Manual checks

1. Launch FORM and confirm the home screen shows the current day, weekly plan, 4:00 AM wake-up, 5:00 AM workout, and 5:30 AM finish times.
2. Tap **START TODAY'S WORKOUT**, open an exercise, and verify the image, instructions, target, and rest time load.
3. For a repetition exercise, use `+`/`-` to count reps, then complete the set.
4. For a timed exercise, start the timer, let it finish, and complete the exercise.
5. Let the rest timer finish and confirm the next exercise becomes available.
6. Complete the session and confirm the summary, history entry, and streak update.
7. Force-stop and relaunch FORM; confirm the workout history remains.
8. Put the device in airplane mode and repeat steps 1–7; all app content should remain available.
9. From the ALARM screen, allow notifications and schedule the wake-up and workout reminders. Confirm pending notifications exist.
10. Change the device time across 4:00 AM (03:59 to 04:00) and confirm the app moves to the new training day.

### Verified release results

The v1.0 release APK was installed and tested on an Android 16 (API 36.1) emulator with networking disabled:

- The home screen, weekly plan, exercise cards, and bundled exercise images loaded offline.
- The 4:00 AM reset produced the previous training day at 03:59 and the current training day at 04:00.
- Exercise completion, rep counting, exercise timers, and rest timers worked.
- Workout records persisted after force-stop and relaunch.
- Wake-up and workout notifications were scheduled with IDs `4001` (4:00 AM) and `5001` (5:00 AM), repeating daily.
- The release APK verifies with APK Signature Scheme v1 and v2.
- WebView debugging is disabled in the release build; no WebView DevTools socket was exposed.

## Release information

### FORM v1.0 — Official Release

- Release: [FORM v1.0 — Official Release](https://github.com/Harsha240105/FrOm/releases/tag/v1.0)
- Tag: `v1.0`
- Target branch: `main`
- Version: `1.0` (version code `1`)
- Release APK: [FORM-v1.0-release.apk](https://github.com/Harsha240105/FrOm/releases/download/v1.0/FORM-v1.0-release.apk)
- SHA-256: `07DB03127B639711A4A2A1F815E94826C16BB7087451642DA7E2B11D7CEF755E`

### Signing verification

- APK Signature Scheme v1 (JAR signing): verified
- APK Signature Scheme v2: verified
- Signer certificate DN: `CN=FORM, OU=Android, O=FORM, L=Private, ST=Private, C=IN`
- Signer certificate SHA-256: `a5cd73c6c33f33eff4050ebef75aea7044ae817f92802e714589b98f6dbb1d84`
- Key algorithm: RSA 4096-bit

Verify the downloaded APK signature with the Android SDK build tools:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\34.0.0\apksigner.bat" verify --verbose --print-certs .\FORM-v1.0-release.apk
```

## Repository

- GitHub: https://github.com/Harsha240105/FrOm
- Latest release: https://github.com/Harsha240105/FrOm/releases/latest
