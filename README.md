# Map Location App

Expo Router app with tab-based screens for:
- viewing the current user location on a map,
- searching addresses and reverse-geocoding map taps,
- sending a local notification when entering the TD Arena geofence.

## Install Dependencies

Install everything from `package.json`:

```bash
npm install
```

If you are building this project manually from scratch, these are the required dependencies:

```bash
npm install @expo/vector-icons @react-navigation/bottom-tabs @react-navigation/elements @react-navigation/native expo expo-constants expo-font expo-haptics expo-image expo-linking expo-location expo-notifications expo-router expo-splash-screen expo-status-bar expo-symbols expo-system-ui expo-task-manager expo-web-browser react react-dom react-native react-native-gesture-handler react-native-maps react-native-reanimated react-native-safe-area-context react-native-screens react-native-web react-native-worklets
```

Required dev dependencies:

```bash
npm install -D @types/react eslint eslint-config-expo typescript
```

## Run the App

```bash
npx expo start
```

Optional platform shortcuts:

```bash
npm run ios
npm run android
npm run web
```

## High-Level File Overview

### `app/(tabs)/index.tsx`
- Requests foreground location permission when the screen mounts.
- Shows an error + Settings prompt if permission is denied.
- Shows a loading indicator while waiting for GPS coordinates.
- Renders a `MapView` centered on the user’s current location with `showsUserLocation` enabled.

### `app/(tabs)/mapSearch.tsx`
- Starts with a default map region (Charleston, SC).
- Implements forward geocoding (`Location.geocodeAsync`) to convert typed addresses into coordinates.
- Animates the map camera and updates a marker to searched coordinates.
- Implements reverse geocoding (`Location.reverseGeocodeAsync`) on map tap to display a human-readable address.
- Displays selected place info in a bottom card.

### `app/(tabs)/tdNotifications.tsx`
- Defines TD Arena coordinates and a geofence radius (100m).
- Requests location + notification permissions.
- Watches live location updates (`Location.watchPositionAsync`) and computes distance using a Haversine helper.
- Triggers an immediate local notification when entering the geofence.
- Resets the “entered” flag after leaving the zone so notifications can trigger again on re-entry.
- Renders a map with a TD Arena marker and geofence circle overlay.

> Note: The file in this project is named `tdNotifications.tsx` (plural).
