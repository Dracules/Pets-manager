import * as yup from 'yup';

const loginSchema = yup.object({
  login: yup
    .string()
    .required('Login is required')
    .min(3, 'Login must be at least 3 characters')
    .max(20, 'Login must be 20 characters or less')
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      'The login can contain only: a-z, A-Z, 0-9, _, -',
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password must not be empty'),
});

export default loginSchema;
