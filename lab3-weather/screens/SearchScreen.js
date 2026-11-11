import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { doSearch, clearResults } from '../store/searchSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import CityRow from '../components/CityRow';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((s) => s.search);
  const favorites = useSelector((s) => s.favorites.cities);

  // пошук із затримкою після введення
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      dispatch(clearResults());
      return;
    }
    const t = setTimeout(() => dispatch(doSearch(q)), 400);
    return () => clearTimeout(t);
  }, [query, dispatch]);

  const open = (city) => navigation.navigate('Weather', { city });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Наприклад: Київ, Lviv, London..."
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />
      {loading && <ActivityIndicator style={{ margin: 10 }} color="#1e88e5" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && query.trim().length >= 2 && results.length === 0 && !error && (
        <Text style={styles.empty}>Нічого не знайдено</Text>
      )}
      <FlatList
        data={results}
        keyExtractor={(c) => String(c.id)}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <CityRow
            city={item}
            onPress={open}
            isFavorite={favorites.some((f) => f.id === item.id)}
            onToggleFavorite={(c) => dispatch(toggleFavorite(c))}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9' },
  input: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dde3ea',
  },
  error: { color: '#d32f2f', textAlign: 'center', margin: 10 },
  empty: { color: '#777', textAlign: 'center', margin: 20 },
});
