"use client"

import {Logo} from "@/components";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useFormik} from "formik";
import {ResetPasswordSchema} from "@repo/common/types";
import {ResetPasswordSchemaType} from "@/iterfaces";
import {userResetPassword} from "@/store/features/auth/authActions";
import {useAppDispatch} from "@/store/hooks";
import {toast} from "@/utils";
import {useRouter} from "next/navigation";

export default function ResetPassword() {

    const dispatch = useAppDispatch();

    const params = new URL(window.location.href).searchParams;
    const token = params.get("token") ?? '';

    const formik = useFormik<ResetPasswordSchemaType>({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: ResetPasswordSchema,
        onSubmit: async (values: ResetPasswordSchemaType) => {
            const result = await dispatch(userResetPassword({...values, token}))

            if (userResetPassword.fulfilled.match(result)) {
                toast.success('Password reset successfully. Please Sign in!')
            }

            if (userResetPassword.rejected.match(result)) {
                toast.error('Failed to reset password. Please try again later.')
            }
        }
    })

    return <div
        className='w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600'>
        <div className='p-8 bg-white rounded-lg shadow-2xl w-full max-w-md'>

            <div className="flex items-center justify-center mb-5">
                <Logo/>
            </div>

            <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
                Forgot Password
            </h1>

            <form className='space-y-6' onSubmit={formik.handleSubmit} id={"reset-password-form"}>


                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" id="password" placeholder="Password" {...formik.getFieldProps("password")}/>

                    {formik.errors.password && formik.touched.password && (
                        <div
                            className="text-sm text-red-600">
                            {formik.errors.password}
                        </div>
                    )}
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input type="password" id="confirmPassword"
                           placeholder="Confirm Password" {...formik.getFieldProps("confirmPassword")}/>

                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                        <div
                            className="text-sm text-red-600">
                            {formik.errors.confirmPassword}
                        </div>
                    )}
                </div>

            </form>

            <div className="my-5">
                <Button type="submit" form="reset-password-form">
                    Reset Password
                </Button>
            </div>

        </div>
    </div>
}