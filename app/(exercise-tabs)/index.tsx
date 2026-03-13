import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Button, Linking, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

// Type definition for our parking spot
type Coordinate = {
  latitude: number;
  longitude: number;
};

export default function Parking() {
  // State variables are ready to go
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [parkingSpot, setParkingSpot] = useState<Coordinate | null>(null);

  useEffect(() => {
    (async () => {
      // TODO 1: Request Foreground Location permissions here.
      // If granted, set `hasPermission` to true. If not, set it to false.
      // If not granted, allow user to go to setting to turn on tracking
      let {status} = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted'){
        setHasPermission(false)
        Alert.alert("Permission denied"[
          {text: 'Cancel', style: 'cancel'}, {text: 'Go to Settings', onPress: () => Linking.openSettings()}
        ])
      } else{ setHasPermission(true)}
      
    })();
  }, []);

  const saveParkingSpot = async () => {
    try {
      // TODO 2: Use Location.getCurrentPositionAsync() to get a snapshot of the user's location.
      // Make sure to use the 'High' accuracy setting!
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      // TODO 3: Save the latitude and longitude from that snapshot into the `parkingSpot` state.
      setParkingSpot(location.coords);
      
      Alert.alert("Success", "Parking spot saved!");
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    }
  };

  // If permission is denied, show this screen instead of the map
  if (hasPermission === false) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>We need location access to find your car!</Text>
        <Button title="Open Settings" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TODO 4: Add the prop to MapView that shows the user's pulsing blue dot */}
      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: 32.7840, 
          longitude: -79.9360, 
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {/* TODO 5: Write a conditional statement here. 
            If `parkingSpot` has data, render a <Marker> component at those coordinates. */}
            {parkingSpot && (
          <Marker
            coordinate={{
              latitude: parkingSpot.latitude,
              longitude: parkingSpot.longitude,
            }}
          />
        )}
      </MapView>

      {/* Floating UI at the bottom */}
      <View style={styles.bottomCard}>
        <Button 
          title="Save Parking Spot" 
          onPress={saveParkingSpot} 
        />
        
        {/* Bonus Challenge: Clear Spot */}
        {parkingSpot && (
          <View style={{ marginTop: 10 }}>
             <Button 
              title="Clear Spot" 
              color="red" 
              onPress={() => setParkingSpot(null)} 
            />
          </View>
        )}
      </View>
    </View>
  );
}

// ==========================================
// STYLES (No need to edit these!)
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', marginBottom: 20, textAlign: 'center', fontSize: 16 },
  map: { flex: 1 },
  bottomCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});