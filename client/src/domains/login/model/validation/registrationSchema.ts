import * as yup from 'yup';

const registrationSchema = yup.object({
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
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/,
      'The password must contain a lowercase letter, an uppercase letter and a number',
    ),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default registrationSchema;
