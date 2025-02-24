import * as yup from 'yup';



export const CreateUserSchema = yup.object({
  email: yup.string().email("Email must be valid").required("Email is required"),
  name: yup.string().min(3, 'Name must be at least 3 characters').max(20, 'Name cannot be more than 30 characters').required("Name is required"),
  photo: yup.string().optional(),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export const SignInSchema = yup.object({
  password: yup.string().required('Password is required'),
  email: yup.string().email("Email must be valid").required("Email is required"),
});

export const CreateRoomSchema = yup.object({
  slug: yup.string().min(3).max(20).required("Slug is required"),
});

