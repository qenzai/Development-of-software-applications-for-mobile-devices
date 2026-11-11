import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUnit, toggleHourly } from '../store/settingsSlice';
import { clearWeatherCache } from '../store/weatherSlice';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { unit, showHourly } = useSelector((s) => s.settings);
  const favCount = useSelector((s) => s.favorites.cities.length);
  const cachedCount = useSelector((s) => Object.keys(s.weather.byCity).length);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Одиниці температури</Text>
        <View style={styles.segment}>
          {['C', 'F'].map((u) => (
            <TouchableOpacity
              key={u}
              style={[styles.segBtn, unit === u && styles.segActive]}
              onPress={() => dispatch(setUnit(u))}
            >
              <Text style={[styles.segText, unit === u && { color: '#fff' }]}>°{u}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.card, styles.row]}>
        <Text style={styles.label}>Показувати погодинний прогноз</Text>
        <Switch value={showHourly} onValueChange={() => dispatch(toggleHourly())} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Статистика</Text>
        <Text style={styles.info}>Обраних міст: {favCount}</Text>
        <Text style={styles.info}>Міст у кеші прогнозів: {cachedCount}</Text>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => {
            dispatch(clearWeatherCache());
            Alert.alert('Готово', 'Кеш прогнозів очищено');
          }}
        >
          <Text style={{ color: '#fff' }}>Очистити кеш</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Дані: open-meteo.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9', padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  segment: { flexDirection: 'row', marginTop: 10 },
  segBtn: {
    flex: 1, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#1e88e5',
  },
  segActive: { backgroundColor: '#1e88e5' },
  segText: { color: '#1e88e5', fontWeight: '600' },
  info: { color: '#555', marginTop: 6 },
  clearBtn: {
    backgroundColor: '#e53935', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 12,
  },
  footer: { textAlign: 'center', color: '#999', marginTop: 'auto' },
});
