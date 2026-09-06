# GO! Track Express — Mobile App

Expo (React Native, JavaScript) app for GO! Track Express. No login/auth/OTP -
opens straight to Home. Built with Expo Router, TanStack Query, Zustand,
AsyncStorage, i18next (en/hi/mr/bn/kn/te), and Expo Notifications.

## Setup

```bash
cp .env.example .env
# edit .env: EXPO_PUBLIC_API_BASE_URL should point at the running backend
npm install
npm run start
```

Then press `i` for iOS simulator, `a` for Android emulator, `w` for web, or
scan the QR code with Expo Go on a physical device.

## Try it with demo data

No backend credentials are required to explore tracking - the backend ships
with a `DemoTrackingProvider`. Try these AWB numbers from the Home or Track
screen:

- `GO123456789` (delivered)
- `GO987654321` (out for delivery)
- `GO555555555` (in transit)

## Structure

```
app/            Expo Router file-based routes (screens)
components/     Shared UI components
store/          Zustand stores (app config/language, recent shipments)
api/            Axios API client per backend resource
hooks/          TanStack Query hooks wrapping the API client
i18n/           i18next setup + locale JSON files (en/hi/mr/bn/kn/te)
constants/      Brand, status, and language constants
utils/          Device id, formatters, push notification helpers
```

## Deep linking

The app registers both a custom scheme (`go-track://track/:awb`) and a
universal link (`https://example.com/track/:awb`) via `app.json`. Replace
`example.com` with your real domain before shipping, and configure the
associated Apple App Site Association / Android Digital Asset Links files
on that domain.

## Notes

- All content (services/products/CMS) is backend-driven — no hardcoded
  external URLs, phone numbers, or copy live in this app.
- Static UI strings are localized via i18next; English and Hindi are fully
  translated, the remaining four languages have core navigation/labels
  translated with an automatic fallback to English for anything not yet
  localized.
- Push notifications degrade gracefully: on a simulator/without a real
  Firebase project, the backend logs a "would push" message instead of
  failing.
