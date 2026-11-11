import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { toggleFavorite } from '../store/favoritesSlice';
import CityRow from '../components/CityRow';

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites.cities);

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="star-outline" size={64} color="#bbb" />
        <Text style={styles.emptyText}>Ще немає обраних міст.</Text>
        <Text style={styles.emptyText}>Натисніть ☆ у пошуку, щоб додати.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: '#f2f5f9' }}
      data={favorites}
      keyExtractor={(c) => String(c.id)}
      renderItem={({ item }) => (
        <CityRow
          city={item}
          isFavorite
          onPress={(city) => navigation.navigate('Weather', { city })}
          onToggleFavorite={(c) => dispatch(toggleFavorite(c))}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f2f5f9' },
  emptyText: { color: '#777', marginTop: 8, fontSize: 15 },
});
