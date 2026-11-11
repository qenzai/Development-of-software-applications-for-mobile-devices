// Open-Meteo — безкоштовне API без ключа
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(name) {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(name)}&count=15&language=uk`);
  if (!res.ok) throw new Error('Помилка мережі');
  const json = await res.json();
  return (json.results || []).map((c) => ({
    id: c.id,
    name: c.name,
    country: c.country || '',
    region: c.admin1 || '',
    latitude: c.latitude,
    longitude: c.longitude,
  }));
}

export async function fetchForecast(lat, lon, unit) {
  const params = [
    `latitude=${lat}`,
    `longitude=${lon}`,
    'current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    'hourly=temperature_2m,weather_code',
    'daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    'forecast_days=7',
    'timezone=auto',
    `temperature_unit=${unit === 'F' ? 'fahrenheit' : 'celsius'}`,
  ].join('&');
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error('Помилка мережі');
  return res.json();
}
