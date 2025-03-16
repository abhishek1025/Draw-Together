import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StrokeStyleType } from "@/iterfaces";

interface CanvasStateType {
  stroke: string;
  bgColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyleType;
}

const initialState: CanvasStateType = {
  stroke: "#ffffff",
  bgColor: "transparent",
  strokeWidth: 1,
  strokeStyle: "solid",
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setStroke(state, action: PayloadAction<string>) {
      state.stroke = action.payload;
    },

    setBgColor(state, action: PayloadAction<string>) {
      state.bgColor = action.payload;
    },

    setStrokeWidth(state, action: PayloadAction<number>) {
      state.strokeWidth = action.payload;
    },

    setStrokeStyle(state, action: PayloadAction<StrokeStyleType>) {
      state.strokeStyle = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStroke, setBgColor, setStrokeWidth, setStrokeStyle } =
  canvasSlice.actions;

export default canvasSlice.reducer;
