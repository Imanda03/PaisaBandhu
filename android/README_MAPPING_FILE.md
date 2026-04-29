# Mapping File for Deobfuscation

When you build a release bundle with R8/ProGuard enabled, a mapping file is automatically generated.

## Location
The mapping file will be located at:
```
android/app/build/outputs/mapping/release/mapping.txt
```

## Uploading to Google Play Console

1. After building your release bundle, navigate to:
   - Google Play Console → Your App → Release → Production/Testing
   - Click on the version you want to upload the mapping file for
   - Scroll down to "App bundles and APKs"
   - Click on your AAB file
   - Click "Upload" next to "Deobfuscation file"
   - Select the `mapping.txt` file from the location above

## Important Notes

- **Keep this file safe!** You'll need it to deobfuscate crash reports
- The mapping file is specific to each build - you need the exact mapping file that matches your uploaded AAB
- Store mapping files for each release version for future debugging

## Building Release Bundle

```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

After building, the mapping file will be at:
`android/app/build/outputs/mapping/release/mapping.txt`
