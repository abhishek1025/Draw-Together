import { createSlice } from "@reduxjs/toolkit";
import { addNewRoom } from "@/store/features/room/roomActions";
import { RoomReduxStateType } from "@/interfaces";

const initialState: RoomReduxStateType = {
  roomFormError: undefined,
  roomFormLoading: false,
};

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewRoom.fulfilled, (state) => {
        state.roomFormError = undefined;
        state.roomFormLoading = false;
      })
      .addCase(addNewRoom.rejected, (state, action) => {
        state.roomFormError = action.payload?.message;
        state.roomFormLoading = false;
      })
      .addCase(addNewRoom.pending, (state) => {
        state.roomFormError = undefined;
        state.roomFormLoading = true;
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = roomSlice.actions;

export default roomSlice.reducer;
