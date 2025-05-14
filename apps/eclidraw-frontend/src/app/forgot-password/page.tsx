'use client';

import { Logo } from '@/components';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { userForgotPassword } from '@/store/features/auth/authActions';
import { toast } from '@/utils';
import { ForgotPasswordSchema } from '@repo/common/types';
import { ForgotPasswordSchemaType } from '@/interfaces';
import { Button, Input } from 'antd';

export default function ForgotPassword() {
  const dispatch = useAppDispatch();

  const formik = useFormik<ForgotPasswordSchemaType>({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values: ForgotPasswordSchemaType) => {
      const result = await dispatch(userForgotPassword(values.email));

      if (userForgotPassword.fulfilled.match(result)) {
        toast.success(
          'Password reset email sent successfully. Please check your inbox!'
        );
      }

      if (userForgotPassword.rejected.match(result)) {
        toast.error(
          'Failed to send password reset email. Please try again later.'
        );
      }
    },
  });

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600'>
      <div className='p-8 bg-white rounded-lg shadow-2xl w-full max-w-md'>
        <div className='flex items-center justify-center mb-5'>
          <Logo />
        </div>

        <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
          Forgot Password
        </h1>

        <form
          className='space-y-6'
          onSubmit={formik.handleSubmit}
          id={'forgot-password-form'}>
          <div className='grid w-full max-w-sm items-center gap-1.5'>
            <label htmlFor='email'>Email</label>
            <Input
              type='text'
              id='email'
              placeholder='Email'
              {...formik.getFieldProps('email')}
            />

            {formik.errors.email && formik.touched.email && (
              <div className='text-sm text-red-600'>
                {formik.errors.email.toString()}
              </div>
            )}
          </div>
        </form>

        <div className='my-5'>
          <Button htmlType='submit' type='primary' form='forgot-password-form'>
            Forgot Password
          </Button>
        </div>

        <p className='mt-6 text-center text-gray-600'>
          Remember the password ?
          <Link href={'/sign-in'} className='text-blue-600 hover:underline'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

