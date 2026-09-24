# GoTrack Express — Android Keystore Information

## Application

| Field                       | Value                        |
| --------------------------- | ---------------------------- |
| App Name                    | GoTrack Express              |
| Package / Bundle Identifier | `com.ship.gotrackexpress`    |
| Platform                    | Android                      |
| Keystore Type               | JKS                          |
| Keystore File               | `gotrackexpress-release.jks` |

## Keystore Credentials

| Field             | Value            |
| ----------------- | ---------------- |
| Keystore Password | `gotrackexpress` |
| Key Alias         | `com.ship.gotrackexpress` |
| Key Password      | `gotrackexpress` |
| Key Algorithm     | RSA              |
| Key Size          | 2048 bits        |
| Validity          | 10,000 days      |

## Certificate Information

| Field                    | Value           |
| ------------------------ | --------------- |
| Common Name (CN)         | GoTrack Express |
| Organizational Unit (OU) | GoTrack Express |
| Organization (O)         | GoTrack Express |
| City (L)                 | Delhi           |
| State (ST)               | Delhi           |
| Country (C)              | IN              |

## Keystore Generation Command

```powershell
keytool -genkeypair -v `
  -keystore gotrackexpress-release.jks `
  -storepass "gotrackexpress" `
  -keypass "gotrackexpress" `
  -alias "com.ship.gotrackexpress" `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000 `
  -dname "CN=GoTrack Express, OU=GoTrack Express, O=GoTrack Express, L=Delhi, ST=Delhi, C=IN"
```

## Verify Keystore

Run:

```powershell
keytool -list -v `
  -keystore gotrackexpress-release.jks `
  -storepass "gotrackexpress"
```

Expected alias:

```text
gotrackexpress
```

## Android Gradle Configuration

If configuring manually in `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("gotrackexpress-release.jks")
            storePassword "gotrackexpress"
            keyAlias "gotrackexpress"
            keyPassword "gotrackexpress"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## Expo Configuration

If using Expo/EAS credentials, the corresponding values are:

```text
Package: com.ship.gotrackexpress
Keystore: gotrackexpress-release.jks
Keystore Password: gotrackexpress
Key Alias: gotrackexpress
Key Password: gotrackexpress
```

## Important Security Note

This file contains the **private keystore password**.

Do **NOT** commit this file or the `.jks` file to a public GitHub repository.

Recommended `.gitignore` entries:

```gitignore
*.jks
*.keystore
KEYSTORE.md
```

Keep a secure backup of:

```text
gotrackexpress-release.jks
```

along with:

```text
Keystore Password: gotrackexpress
Key Alias: gotrackexpress
Key Password: gotrackexpress
```

The same signing key should be preserved for future Android/Google Play Store updates.
