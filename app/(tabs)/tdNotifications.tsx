import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, Linking } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// ==========================================
// 1. CONSTANTS & CONFIGURATION
// ==========================================
const TD_ARENA_LAT = 32.7856;
const TD_ARENA_LNG = -79.9344;
const GEOFENCE_RADIUS = 100; // in meters

// Force notifications to show up as a banner when the app is open!
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


// ==========================================
// 2. MATH HELPER: HAVERSINE FORMULA
// ==========================================
// Calculates the distance in meters between two GPS coordinates
const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (deg: number) => deg * (Math.PI / 180);
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // We use a ref instead of state to track if they've entered the zone.
  // This prevents the notification from firing every single second!
  const hasEnteredZone = useRef(false);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      // 1. Request Permissions (Foreground Only!)
      const locStatus = await Location.requestForegroundPermissionsAsync();
      if (locStatus.status === 'granted') {
        setErrorMsg(null)
      }
      if (locStatus.status !== 'granted') {
        setErrorMsg('Foreground location permission is required.');
        return;
      }

      const notifStatus = await Notifications.requestPermissionsAsync();
      if (notifStatus.status !== 'granted') {
        setErrorMsg('Notification permissions are required.');
        return;
      }

      // 2. Start the Location Stream
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Only fire callback if they move at least 10 meters
        },
        (newLocation) => {
          // Update the map UI
          setLocation(newLocation);

          // Calculate how far the user is from TD Arena
          const distance = getDistanceInMeters(
            newLocation.coords.latitude,
            newLocation.coords.longitude,
            TD_ARENA_LAT,
            TD_ARENA_LNG
          );

          // 3. The Geofence Logic
          if (distance <= GEOFENCE_RADIUS) {
            // If they are inside the circle AND haven't been notified yet
            if (!hasEnteredZone.current) {
              console.log("Crossed into the zone! Triggering notification...");
              
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "🏀 Welcome to TD Arena!",
                  body: "Go Cougars! Tap here for your digital tickets.",
                  sound: true,
                },
                trigger: null, // Fire immediately
              });

              // Mark that they have entered so we don't spam them
              hasEnteredZone.current = true;
            }
          } else {
            // If they leave the circle, reset the tracker so they can be notified again later
            if (hasEnteredZone.current) {
              console.log("Left the zone. Resetting tracker.");
              hasEnteredZone.current = false;
            }
          }
        }
      );
    })();

    // Cleanup function: Stop tracking when the component unmounts
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // ==========================================
  // 4. RENDER UI
  // ==========================================
  if (errorMsg) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={{ color: 'red', marginBottom: 20 }}>{errorMsg}</Text>
        <Button title="Open Settings" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Pinpointing location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation={true} 
      >
        <Marker 
          coordinate={{ latitude: TD_ARENA_LAT, longitude: TD_ARENA_LNG }} 
          title="TD Arena" 
        />
        <Circle
          center={{ latitude: TD_ARENA_LAT, longitude: TD_ARENA_LNG }}
          radius={GEOFENCE_RADIUS}
          fillColor="rgba(255, 0, 0, 0.2)"
          strokeColor="rgba(255, 0, 0, 0.5)"
          strokeWidth={2}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  map: { flex: 1 },
});