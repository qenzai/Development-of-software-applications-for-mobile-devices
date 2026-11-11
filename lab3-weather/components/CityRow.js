import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CityRow({ city, onPress, isFavorite, onToggleFavorite }) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(city)}>
      <Ionicons name="location-outline" size={22} color="#1e88e5" />
      <View style={styles.info}>
        <Text style={styles.name}>{city.name}</Text>
        <Text style={styles.sub}>{[city.region, city.country].filter(Boolean).join(', ')}</Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFavorite(city)} hitSlop={10}>
        <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={24} color="#fbc02d" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 17, fontWeight: '600' },
  sub: { color: '#777', marginTop: 2 },
});
