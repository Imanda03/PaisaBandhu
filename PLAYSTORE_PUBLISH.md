# Publish to Google Play Store

## 1. Version (already updated)

- **versionCode:** `3` (in `android/app/build.gradle`) — must increase for every Play Store upload
- **versionName:** `2.0.1` — user-visible version
- **package.json / app.json:** `2.0.1` — kept in sync

For future releases, bump **versionCode** by 1 and set **versionName** (e.g. `2.0.2`, `2.1.0`, `3.0.0`).

---

## 2. Release signing (keystore)

You already have `android/keystore.properties`. Ensure it points to your release keystore:

```properties
MYAPP_RELEASE_STORE_FILE=your-release-key.keystore
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_ALIAS=your-key-alias
MYAPP_RELEASE_KEY_PASSWORD=****
```

The `.keystore` file should be in `android/app/` (or use a path relative to the project). **Keep the keystore and passwords safe** — you need them for every future update.

---

## 3. Build release AAB (Android App Bundle)

From the project root:

```bash
cd android
./gradlew bundleRelease
```

Output AAB path:

```
android/app/build/outputs/bundle/release/app-release.aab
```

Use this `.aab` file for Play Store upload (not APK).

---

## 4. Optional: test release build locally

```bash
cd android
./gradlew assembleRelease
```

APK path: `android/app/build/outputs/apk/release/app-release.apk`. Install on a device to verify before publishing.

---

## 5. Google Play Console

1. Go to [Google Play Console](https://play.google.com/console).
2. Select your app (or create one with package name `com.paisebandhu`).
3. **Production** (or **Testing** → Internal/Closed testing):
   - Create new release → Upload `app-release.aab`.
   - Set release name (e.g. "2.0.1 (3)") and release notes.
4. Complete **Store listing** (title, short/full description, screenshots, icon, etc.) if not done.
5. Ensure **Content rating**, **Privacy policy**, and **Target audience** are completed.
6. Review and **Start rollout to Production** (or to your chosen track).

---

## 6. After publishing

- Each new upload must have a **higher versionCode** than the previous one.
- Update **versionName** and **versionCode** in `android/app/build.gradle` (and optionally `package.json` / `app.json`) for every release, then run `./gradlew bundleRelease` again.

---

## Quick reference

| Step              | Command / action                                      |
|-------------------|--------------------------------------------------------|
| Bump version      | Edit `android/app/build.gradle` (versionCode, versionName) |
| Build AAB         | `cd android && ./gradlew bundleRelease`               |
| AAB location      | `android/app/build/outputs/bundle/release/app-release.aab` |
| Upload            | Play Console → Your app → Release → Upload AAB        |
