'use client';

import { Logo } from '@/components';
import { useFormik } from 'formik';
import { ResetPasswordSchema } from '@repo/common/types';
import { ResetPasswordSchemaType } from '@/interfaces';
import { userResetPassword } from '@/store/features/auth/authActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from '@/utils';
import { Button, Input, Spin } from 'antd';

export default function ResetPassword() {
  const { resetPasswordLoading } = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();

  const params = new URL(window.location.href).searchParams;
  const token = params.get('token') ?? '';

  const formik = useFormik<ResetPasswordSchemaType>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values: ResetPasswordSchemaType) => {
      const result = await dispatch(userResetPassword({ ...values, token }));

      if (userResetPassword.fulfilled.match(result)) {
        toast.success('Password reset successfully. Please Sign in!');
      }

      if (userResetPassword.rejected.match(result)) {
        toast.error('Failed to reset password. Please try again later.');
      }
    },
  });

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600'>
      <div className='p-8 bg-white rounded-lg shadow-2xl w-full max-w-md'>
        <Spin spinning={resetPasswordLoading}>
          <div className='flex items-center justify-center mb-5'>
            <Logo />
          </div>

          <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
            Forgot Password
          </h1>

          <form
            className='space-y-6'
            onSubmit={formik.handleSubmit}
            id={'reset-password-form'}>
            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <label htmlFor='password'>Password</label>
              <Input.Password
                type='password'
                id='password'
                placeholder='Password'
                {...formik.getFieldProps('password')}
              />

              {formik.errors.password && formik.touched.password && (
                <div className='text-sm text-red-600'>
                  {formik.errors.password}
                </div>
              )}
            </div>

            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <Input.Password
                type='password'
                id='confirmPassword'
                placeholder='Confirm Password'
                {...formik.getFieldProps('confirmPassword')}
              />

              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <div className='text-sm text-red-600'>
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
          </form>

          <div className='my-5'>
            <Button
              htmlType='submit'
              type='primary'
              form='reset-password-form'
              className='w-full'>
              Reset Password
            </Button>
          </div>
        </Spin>
      </div>
    </div>
  );
}

