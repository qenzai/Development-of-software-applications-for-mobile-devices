import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { unit: 'C', showHourly: true },
  reducers: {
    setUnit(state, action) {
      state.unit = action.payload;
    },
    toggleHourly(state) {
      state.showHourly = !state.showHourly;
    },
  },
});

export const { setUnit, toggleHourly } = settingsSlice.actions;
export default settingsSlice.reducer;
