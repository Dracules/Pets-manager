import { SubmitHandler, useForm } from 'react-hook-form';
import { isApiError } from '../../../shared/api/apiClient';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Auth } from '../../../shared/api/authApi';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from '../model/validation/loginSchema';
import { LoginFormInput } from '../model/form-input.interface';
import styles from './css/AuthPages.module.css';
import { FormField } from './FormField';
import { AuthLayout } from './AuthLayout';
import { SubmitButton } from './SubmitButton';

export default function LoginPage() {
  const methods = useForm<LoginFormInput>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const [message, setMessage] = useState('');
  const { token, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const errors = methods.formState.errors;

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    setMessage('');
    try {
      const result = await Auth.signIn(data.login, data.password);
      if (result.access_token && result.refresh_token) {
        login(result);
      } else setMessage('Something wrong!');
    } catch (e) {
      if (isApiError(e) && e.response?.status === 401) {
        setMessage('Wrong login or password!');
      } else {
        setMessage('Error: ' + (e instanceof Error ? e.message : String(e)));
      }
    }
  };
  if (token.access_token) {
    return <AuthLayout title={'You have already been authorized!'} />;
  }

  return (
    <AuthLayout
      title={'Login'}
      message={message}
      footerLink={{ to: '/register', text: "Don't have an account? Sign up" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isSubmitting} className={styles.fieldset}>
          <FormField
            label={'Login'}
            name={'login'}
            placeholder={'Enter login'}
            register={register}
            error={errors.login}
          />
          <FormField
            label={'Password'}
            name={'password'}
            type={'password'}
            placeholder={'Enter password'}
            register={register}
            error={errors.password}
          />
          <SubmitButton title={'Login'} isSubmitting={isSubmitting} />
        </fieldset>
      </form>
    </AuthLayout>
  );
}
