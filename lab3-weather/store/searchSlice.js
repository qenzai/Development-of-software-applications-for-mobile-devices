import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchCities } from '../api';

export const doSearch = createAsyncThunk('search/doSearch', async (query) => {
  return searchCities(query);
});

const searchSlice = createSlice({
  name: 'search',
  initialState: { results: [], loading: false, error: null, lastQuery: '' },
  reducers: {
    clearResults(state) {
      state.results = [];
      state.error = null;
      state.lastQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(doSearch.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastQuery = action.meta.arg;
      })
      .addCase(doSearch.fulfilled, (state, action) => {
        // ігноруємо застарілі відповіді
        if (action.meta.arg !== state.lastQuery) return;
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(doSearch.rejected, (state, action) => {
        if (action.meta.arg !== state.lastQuery) return;
        state.loading = false;
        state.error = action.error.message || 'Помилка';
      });
  },
});

export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;
