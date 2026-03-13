import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

export default function Index() {
  // 1. Define strictly typed state variables
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2. Use an effect to prompt the user as soon as the component mounts
  useEffect(() => {
    (async () => {
      // Step A: Ask for foreground permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      // Step B: Handle the rejection case gracefully
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable it in settings.');
        Alert.alert(
          "Permission Denied",
          "Please allow location access in settings.",
          [ {text: 'Cancel', style: 'cancel'},
            {text: 'Go to Settings', onPress: () => Linking.openSettings()}
          ]
        );

        return;
      }

      // Step C: Fetch the actual coordinates
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  // 3. Conditional Rendering: Error State
  if (errorMsg) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // 4. Conditional Rendering: Loading State (Waiting for GPS lock)
  if (!location) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Pinpointing your location...</Text>
      </View>
    );
  }

  // 5. Success State: Render the MapView and Marker
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // Center the map on the fetched coordinates
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01, // Controls how "zoomed in" we are (smaller = closer)
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {/* <Marker
          // Place the pin at the exact same coordinates
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
          description="This is your current device location"
        /> */}
      </MapView>
    </View>
  );
}

// 6. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});