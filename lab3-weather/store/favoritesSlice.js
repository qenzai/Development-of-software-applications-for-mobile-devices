import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { cities: [] },
  reducers: {
    toggleFavorite(state, action) {
      const city = action.payload;
      const idx = state.cities.findIndex((c) => c.id === city.id);
      if (idx >= 0) {
        state.cities.splice(idx, 1);
      } else {
        state.cities.push(city);
      }
    },
    removeFavorite(state, action) {
      state.cities = state.cities.filter((c) => c.id !== action.payload);
    },
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
