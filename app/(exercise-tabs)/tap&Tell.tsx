import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

type Coordinate = {
  latitude: number;
  longitude: number;
};

export default function App() {
  const [markerCoords, setMarkerCoords] = useState<Coordinate | null>(null);
  const [address, setAddress] = useState<string>('Tap anywhere on the map!');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // This function runs whenever the map is tapped
  const handleMapPress = async (event: MapPressEvent) => {
    // TODO 1: Extract the latitude and longitude from the tap event.
    // Hint: Look inside event.nativeEvent.coordinate

    // TODO 2: Update the 'markerCoords' state so the pin moves to the tapped location.

    setIsLoading(true);
    setAddress('Translating coordinates...');

    try {
      // TODO 3: Call Location.reverseGeocodeAsync() using the tapped coordinates.

      // TODO 4: Check if the result array has at least one item. 
      // If it does, extract the street, city, and region, and update the 'address' state.
      // If it doesn't (they tapped the ocean), set the address to "Unknown Location".

    } catch (error) {
      setAddress('Error finding address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* TODO 5: Attach the handleMapPress function to the MapView's onPress prop */}
      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: 32.7765, // Centered near Charleston, SC
          longitude: -79.9311, 
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* TODO 6: Render a <Marker> here, but only if markerCoords is not null! */}
        
      </MapView>

      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>Selected Address:</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Text style={styles.cardAddress}>{address}</Text>
        )}
      </View>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  bottomCard: {
    position: 'absolute', bottom: 40, left: 20, right: 20, 
    backgroundColor: '#fff', padding: 20, borderRadius: 15, 
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 10,
  },
  cardTitle: { fontSize: 14, color: '#666', marginBottom: 5, textTransform: 'uppercase' },
  cardAddress: { fontSize: 18, fontWeight: '600', color: '#333' },
});