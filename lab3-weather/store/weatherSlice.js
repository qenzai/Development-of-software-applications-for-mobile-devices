import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchForecast } from '../api';

// прогноз кешується за id міста
export const loadWeather = createAsyncThunk('weather/load', async (city, { getState }) => {
  const unit = getState().settings.unit;
  const data = await fetchForecast(city.latitude, city.longitude, unit);
  return { id: city.id, data, unit };
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { byCity: {} }, // { [id]: { data, loading, error, unit } }
  reducers: {
    clearWeatherCache(state) {
      state.byCity = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWeather.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.byCity[id] = { ...(state.byCity[id] || {}), loading: true, error: null };
      })
      .addCase(loadWeather.fulfilled, (state, action) => {
        const { id, data, unit } = action.payload;
        state.byCity[id] = { data, unit, loading: false, error: null };
      })
      .addCase(loadWeather.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.byCity[id] = { ...(state.byCity[id] || {}), loading: false, error: action.error.message };
      });
  },
});

export const { clearWeatherCache } = weatherSlice.actions;
export default weatherSlice.reducer;
