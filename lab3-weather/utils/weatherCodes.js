// Коди погоди WMO -> опис + іконка Ionicons
const CODES = {
  0: ['Ясно', 'sunny'],
  1: ['Переважно ясно', 'partly-sunny'],
  2: ['Мінлива хмарність', 'partly-sunny'],
  3: ['Хмарно', 'cloudy'],
  45: ['Туман', 'cloudy'],
  48: ['Туман з інеєм', 'cloudy'],
  51: ['Легка мряка', 'rainy'],
  53: ['Мряка', 'rainy'],
  55: ['Сильна мряка', 'rainy'],
  61: ['Невеликий дощ', 'rainy'],
  63: ['Дощ', 'rainy'],
  65: ['Сильний дощ', 'rainy'],
  66: ['Крижаний дощ', 'rainy'],
  67: ['Сильний крижаний дощ', 'rainy'],
  71: ['Невеликий сніг', 'snow'],
  73: ['Сніг', 'snow'],
  75: ['Сильний сніг', 'snow'],
  77: ['Снігова крупа', 'snow'],
  80: ['Злива', 'rainy'],
  81: ['Злива', 'rainy'],
  82: ['Сильна злива', 'thunderstorm'],
  85: ['Снігопад', 'snow'],
  86: ['Сильний снігопад', 'snow'],
  95: ['Гроза', 'thunderstorm'],
  96: ['Гроза з градом', 'thunderstorm'],
  99: ['Гроза з сильним градом', 'thunderstorm'],
};

export function describeWeather(code, isDay = 1) {
  const [text, icon] = CODES[code] || ['Невідомо', 'help-circle'];
  if (!isDay && icon === 'sunny') return { text, icon: 'moon' };
  if (!isDay && icon === 'partly-sunny') return { text, icon: 'cloudy-night' };
  return { text, icon };
}

const DAYS = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
export function dayName(dateStr, index) {
  if (index === 0) return 'Сьогодні';
  return DAYS[new Date(dateStr).getDay()];
}
