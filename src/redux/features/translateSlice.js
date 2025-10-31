import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
};

const translateSlice = createSlice({
  name: "translate",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === "en" ? "ar" : "en";
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { toggleLanguage, setLanguage } = translateSlice.actions;
export const selectTranslate = (state) => state.translate.language;
export default translateSlice.reducer;
