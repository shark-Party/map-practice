import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Keyboard, 
  Alert 
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';

// Default to Charleston, SC
const INITIAL_REGION = {
  latitude: 32.7765,
  longitude: -79.9311,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function mapSearch() {
  // 1. State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: INITIAL_REGION.latitude,
    longitude: INITIAL_REGION.longitude,
  });
  const [displayAddress, setDisplayAddress] = useState('Tap the map or search an address!');

  // 2. Ref for Map Camera Animation
  const mapRef = useRef<MapView>(null);

  // ==========================================
  // 3. FORWARD GEOCODING (Text -> Coordinates)
  // ==========================================
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    // Hide the keyboard for a better user experience
    Keyboard.dismiss(); 
    setDisplayAddress('Searching...');

    try {
      // Ask Expo to translate the string into coordinates
      const geocodedResults = await Location.geocodeAsync(searchQuery);

      if (geocodedResults.length > 0) {
        const { latitude, longitude } = geocodedResults[0];
        
        // Update marker state
        setSelectedLocation({ latitude, longitude });
        setDisplayAddress(`Result for: "${searchQuery}"`);

        // Animate the camera to fly to the new location
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000); // 1000ms (1 second) animation duration

      } else {
        Alert.alert('Not Found', 'Could not find coordinates for that address.');
        setDisplayAddress('Search failed. Try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while searching.');
    }
  };

  // ==========================================
  // 4. REVERSE GEOCODING (Coordinates -> Text)
  // ==========================================
  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    // Move the pin instantly
    setSelectedLocation({ latitude, longitude });
    setDisplayAddress('Loading address details...');

    try {
      // Ask Expo to translate the coordinates into a human-readable address
      const reverseGeocodedResults = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocodedResults.length > 0) {
        const place = reverseGeocodedResults[0];
        
        // Format the address nicely (handling missing data gracefully)
        const street = place.street || place.name || 'Unknown Street';
        const city = place.city || place.subregion || '';
        const region = place.region || '';
        
        setDisplayAddress(`${street}, ${city}, ${region}`.replace(/,\s*,/g, ',')); // Clean up weird commas
        
        // Smoothly center the camera on the tapped location
        mapRef.current?.animateCamera({
          center: { latitude, longitude },
        }, { duration: 500 });

      } else {
        setDisplayAddress('Unknown Location');
      }
    } catch (error) {
      console.error(error);
      setDisplayAddress('Could not load address.');
    }
  };

  // ==========================================
  // 5. RENDER UI
  // ==========================================
  return (
    <View style={styles.container}>
      
      {/* SEARCH BAR UI */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Type an address or city..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch} // Triggers search on keyboard "Return"
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* MAP UI */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        onPress={handleMapPress} // Listens for user taps!
      >
        <Marker 
          coordinate={selectedLocation} 
          title="Selected Location" 
        />
      </MapView>

      {/* ADDRESS CARD UI */}
      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>Location Details:</Text>
        <Text style={styles.cardAddress}>{displayAddress}</Text>
      </View>

    </View>
  );
}

// ==========================================
// 6. STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingTop: 10, // Account for iOS notch / Android status bar
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1, // Ensure it sits above the map
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  cardAddress: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});