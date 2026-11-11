import React, { useEffect, useLayoutEffect } from 'react';
import {
  ScrollView, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { loadWeather } from '../store/weatherSlice';
import { toggleFavorite } from '../store/favoritesSlice';
import { describeWeather, dayName } from '../utils/weatherCodes';

export default function WeatherScreen({ route, navigation }) {
  const { city } = route.params;
  const dispatch = useDispatch();
  const entry = useSelector((s) => s.weather.byCity[city.id]);
  const unit = useSelector((s) => s.settings.unit);
  const showHourly = useSelector((s) => s.settings.showHourly);
  const isFav = useSelector((s) => s.favorites.cities.some((c) => c.id === city.id));

  // завантажуємо, якщо немає даних або змінилась одиниця виміру
  useEffect(() => {
    if (!entry || (!entry.loading && entry.unit !== unit && entry.data)) {
      dispatch(loadWeather(city));
    }
  }, [city, unit]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => dispatch(toggleFavorite(city))}>
          <Ionicons name={isFav ? 'star' : 'star-outline'} size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFav, city, dispatch]);

  if (!entry || (entry.loading && !entry.data)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  if (entry.error && !entry.data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#d32f2f' }}>Помилка: {entry.error}</Text>
        <TouchableOpacity style={styles.retry} onPress={() => dispatch(loadWeather(city))}>
          <Text style={{ color: '#fff' }}>Спробувати ще</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { current, daily, hourly } = entry.data;
  const now = describeWeather(current.weather_code, current.is_day);
  const deg = `°${entry.unit}`;

  // найближчі 24 години, починаючи з поточної
  const startIdx = Math.max(0, hourly.time.findIndex((t) => t >= current.time.slice(0, 13)));
  const hours = hourly.time.slice(startIdx, startIdx + 24).map((t, i) => ({
    time: t.slice(11, 16),
    temp: Math.round(hourly.temperature_2m[startIdx + i]),
    icon: describeWeather(hourly.weather_code[startIdx + i]).icon,
  }));

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={!!entry.loading} onRefresh={() => dispatch(loadWeather(city))} />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.city}>{city.name}</Text>
        <Text style={styles.country}>{city.country}</Text>
        <Ionicons name={now.icon} size={90} color="#fff" />
        <Text style={styles.temp}>{Math.round(current.temperature_2m)}{deg}</Text>
        <Text style={styles.desc}>{now.text}</Text>
        <View style={styles.statsRow}>
          <Stat icon="thermometer-outline" label="Відчувається" value={`${Math.round(current.apparent_temperature)}${deg}`} />
          <Stat icon="water-outline" label="Вологість" value={`${current.relative_humidity_2m}%`} />
          <Stat icon="speedometer-outline" label="Вітер" value={`${Math.round(current.wind_speed_10m)} км/год`} />
        </View>
      </View>

      {showHourly && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Погодинно</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hours.map((h, i) => (
              <View key={i} style={styles.hour}>
                <Text style={styles.hourText}>{i === 0 ? 'Зараз' : h.time}</Text>
                <Ionicons name={h.icon} size={24} color="#1e88e5" />
                <Text style={styles.hourTemp}>{h.temp}°</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Прогноз на 7 днів</Text>
        {daily.time.map((d, i) => {
          const w = describeWeather(daily.weather_code[i]);
          return (
            <View key={d} style={styles.dayRow}>
              <Text style={styles.dayName}>{dayName(d, i)}</Text>
              <Ionicons name={w.icon} size={22} color="#1e88e5" />
              <Text style={styles.dayRain}>💧{daily.precipitation_probability_max[i] ?? 0}%</Text>
              <Text style={styles.dayTemp}>
                {Math.round(daily.temperature_2m_min[i])}° / {Math.round(daily.temperature_2m_max[i])}°
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Stat({ icon, label, value }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={20} color="#fff" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f9' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  retry: { marginTop: 12, backgroundColor: '#1e88e5', padding: 10, borderRadius: 8 },
  hero: { backgroundColor: '#1e88e5', alignItems: 'center', padding: 20, paddingBottom: 24 },
  city: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  country: { color: '#e3f2fd', marginBottom: 8 },
  temp: { color: '#fff', fontSize: 64, fontWeight: '200' },
  desc: { color: '#fff', fontSize: 18 },
  statsRow: { flexDirection: 'row', marginTop: 18 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontWeight: '600', marginTop: 4 },
  statLabel: { color: '#e3f2fd', fontSize: 12 },
  card: { backgroundColor: '#fff', margin: 12, marginBottom: 0, borderRadius: 12, padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  hour: { alignItems: 'center', marginRight: 18 },
  hourText: { color: '#777', fontSize: 12, marginBottom: 4 },
  hourTemp: { fontWeight: '600', marginTop: 4 },
  dayRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  dayName: { width: 90, fontSize: 15 },
  dayRain: { flex: 1, marginLeft: 10, color: '#1e88e5', fontSize: 13 },
  dayTemp: { fontWeight: '600' },
});
