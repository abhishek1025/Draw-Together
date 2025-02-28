import {createAsyncThunk} from "@reduxjs/toolkit";
import {clientPostRequest} from "@/utils";
import {KnownError} from "@/iterfaces";
import {AxiosError} from "axios";

export const userForgotPassword = createAsyncThunk<void, string, { rejectValue: KnownError }>(
    'auth/forgot-password',
    async (email, {rejectWithValue}) => {
        try {
            return await clientPostRequest({
                endpoint: '/auth/forgot-password',
                data: {
                    email
                }
            });

        } catch (err) {
            console.log(err);
            const error = err as AxiosError<KnownError>
            if (!error.response) {
                return rejectWithValue({
                    code: 0,
                    message: error.message,
                    description: error.message
                })
            }

            return rejectWithValue(error.response.data)
        }
    },
)

export const userResetPassword = createAsyncThunk<void, {
    confirmPassword: string;
    password: string;
    token: string;
}, { rejectValue: KnownError }>(
    'auth/reset-password',
    async (resetPasswordData, {rejectWithValue}) => {
        try {

            const res = await fetch(`${process.env?.NEXT_PUBLIC_HTTP_SERVER_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${resetPasswordData.token}`
                },
                body: JSON.stringify({
                    confirmPassword: resetPasswordData.confirmPassword,
                    password: resetPasswordData.password
                })
            });

            if(res.ok) return res.json();

            throw new Error("Failed to reset password");

        } catch (err) {
            const error = err as AxiosError<KnownError>

            return rejectWithValue({
                code: 0,
                message: error.message,
                description: error.message
            })
        }
    },
)