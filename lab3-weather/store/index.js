import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import weatherReducer from './weatherSlice';
import favoritesReducer from './favoritesSlice';
import settingsReducer from './settingsSlice';

const store = configureStore({
  reducer: {
    search: searchReducer,
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
  },
});

export default store;
