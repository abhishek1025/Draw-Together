import { createSlice } from "@reduxjs/toolkit";
import {
  userForgotPassword,
  userResetPassword,
} from "@/store/features/auth/authActions";
import { AuthReduxStateType } from "@/interfaces";

const initialState: AuthReduxStateType = {
  resetPasswordError: undefined,
  resetPasswordLoading: false,
  resetPasswordSuccess: false,

  forgotPasswordError: undefined,
  forgotPasswordSuccess: false,
  forgotPasswordLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Forgot Password
    builder
      .addCase(userForgotPassword.fulfilled, (state) => {
        state.forgotPasswordSuccess = true;
        state.forgotPasswordError = undefined;
        state.forgotPasswordLoading = false;
      })
      .addCase(userForgotPassword.pending, (state) => {
        state.forgotPasswordSuccess = false;
        state.forgotPasswordError = undefined;
        state.forgotPasswordLoading = true;
      })
      .addCase(userForgotPassword.rejected, (state, action) => {
        state.forgotPasswordSuccess = false;
        state.forgotPasswordError = action.payload?.message;
        state.forgotPasswordLoading = true;
      });

    // Reset Password
    builder
      .addCase(userResetPassword.fulfilled, (state) => {
        state.resetPasswordSuccess = true;
        state.resetPasswordError = undefined;
        state.resetPasswordLoading = false;
      })
      .addCase(userResetPassword.pending, (state) => {
        state.resetPasswordSuccess = false;
        state.resetPasswordError = undefined;
        state.resetPasswordLoading = true;
      })
      .addCase(userResetPassword.rejected, (state, action) => {
        state.resetPasswordSuccess = false;
        state.resetPasswordError = action.payload?.message;
        state.resetPasswordLoading = true;
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = authSlice.actions;

export default authSlice.reducer;
