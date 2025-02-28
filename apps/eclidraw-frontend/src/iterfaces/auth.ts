export type ResetPasswordSchemaType = {password: string, confirmPassword: string}

export type ForgotPasswordSchemaType = {email: string}

export interface AuthReduxStateType {
    forgotPasswordLoading: boolean;
    forgotPasswordSuccess: boolean;
    forgotPasswordError: string | undefined;

    resetPasswordLoading: boolean;
    resetPasswordSuccess: boolean;
    resetPasswordError: string | undefined;
}

export type ResetPasswordThunkParamType = {
    confirmPassword: string;
    password: string;
    token: string;
}
