import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// Target Coordinates (e.g., A Local Coffee Shop)
const TARGET_LAT = 32.7900; // Patriots Point area
const TARGET_LNG = -79.9061;
const GEOFENCE_RADIUS = 50; // 50 meters

// Helper Function: Calculates distance in meters between two coordinates
const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; 
  const toRadians = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

// TODO 1: Configure the Notification Handler so banners show up when the app is open!


export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  
  // TODO 2: Create a useRef boolean called 'hasEnteredZone' and set it to false. 
  // We use this to prevent notification spam!

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      // TODO 3: Request Foreground Location AND Notification permissions here.

      // TODO 4: Start watching the user's position using Location.watchPositionAsync.
      // - Update the `location` state with the new data.
      // - Calculate the distance to the TARGET using getDistanceInMeters. Update the `distance` state.
      // - If distance <= GEOFENCE_RADIUS AND hasEnteredZone.current is false:
      //     1. Fire a notification!
      //     2. Set hasEnteredZone.current to true.
      // - If distance > GEOFENCE_RADIUS:
      //     1. Set hasEnteredZone.current to false so it can trigger again later.

    })();

    // Cleanup function
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  if (!location) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text>Finding your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} showsUserLocation={true} initialRegion={{
        latitude: TARGET_LAT, longitude: TARGET_LNG, latitudeDelta: 0.02, longitudeDelta: 0.02
      }}>
        <Marker coordinate={{ latitude: TARGET_LAT, longitude: TARGET_LNG }} title="Target" />
        <Circle center={{ latitude: TARGET_LAT, longitude: TARGET_LNG }} radius={GEOFENCE_RADIUS} fillColor="rgba(0, 255, 0, 0.3)" />
      </MapView>

      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>Coffee Radar</Text>
        <Text>Distance to target: {distance ? `${Math.round(distance)} meters` : 'Calculating...'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
  bottomCard: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
});