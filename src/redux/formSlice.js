import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "form",
  initialState: { values: {}, stage: "basicDetails", userId: "" },
  reducers: {
    setField(state, action) {
      const { id, value } = action.payload;
      state.values[id] = value;
    },
    setAll(state, action) {
      state.values = action.payload || {};
    },
    setStage(state, action) {
      state.stage = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    reset(state) {
      state.values = {};
      state.stage = "basicDetails";
      state.userId = "";
    },
  },
});
export const { setField, setAll, setStage, setUserId, reset } = slice.actions;
export default slice.reducer;
