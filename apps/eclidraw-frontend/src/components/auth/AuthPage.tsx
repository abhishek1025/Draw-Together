'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Button} from "@/components/ui/button";
import {Logo} from "@/components";
import { FormikValues, useFormik} from "formik";
import {CreateUserSchema, SignInSchema} from "@repo/common/types";


type AuthPagesProps<T> = {
  isSignIn: boolean;
  handleSubmitAction: (values: T) => Promise<void>;
  initialValues: T,
}

export default function AuthPage<T extends FormikValues>({ isSignIn, initialValues, handleSubmitAction}: AuthPagesProps<T>) {

  const formik = useFormik<T>({
    initialValues,
    validationSchema: isSignIn ?  SignInSchema : CreateUserSchema,
    onSubmit: async (values: T) => {
     await handleSubmitAction(values)
    }
  })

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600'>
      <div className='p-8 bg-white rounded-lg shadow-2xl w-full max-w-md'>

        <div className="flex items-center justify-center mb-5">
          <Logo />
        </div>

        <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
          {isSignIn ? 'Welcome Back!' : 'Create an Account'}
        </h1>

        <form className='space-y-6' onSubmit={formik.handleSubmit} id={"auth-form"}>
          {
            !isSignIn && (<div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" placeholder="Name" {...formik.getFieldProps("name")}/>

                {formik.errors.name && formik.touched.name && (
                    <div
                        className="text-sm text-red-600">
                      {formik.errors.name.toString()}
                    </div>
                )}
              </div>)
          }

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="text" id="email" placeholder="Email" {...formik.getFieldProps("email")}/>

            {formik.errors.email && formik.touched.email && (
                <div
                    className="text-sm text-red-600">
                  {formik.errors.email.toString()}
                </div>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="Password" {...formik.getFieldProps("password")}/>
            {formik.errors.password && formik.touched.password && (
                <div
                    className="text-sm text-red-600">
                  {formik.errors.password.toString()}
                </div>
            )}
          </div>

        </form>

        <div className="my-5">
          <Button type="submit" form="auth-form">
          {isSignIn ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>

        <p className='mt-6 text-center text-gray-600'>
        {isSignIn ? "Don't have an account? " : 'Already have an account? '}
          <a
            href={isSignIn ? '/sign-up' : '/sign-in'}
            className='text-blue-600 hover:underline'>
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </a>
        </p>
      </div>
    </div>
  );
}

