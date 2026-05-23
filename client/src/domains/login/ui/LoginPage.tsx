import { SubmitHandler, useForm } from 'react-hook-form';
import { isApiError } from '../../../shared/api/apiClient';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Auth } from '../../../shared/api/authApi';
import { Link } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from '../model/validation/loginSchema';
import { LoginFormInput } from '../model/form-input.interface';
import styles from './css/AuthPages.module.css';

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
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h3 className={styles.title}>You have already been authorized!</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={isSubmitting} className={styles.fieldset}>
            <div className={styles.field}>
              <label className={styles.label}>Login</label>
              <input
                {...register('login')}
                className={`${styles.input} ${errors.login ? styles.inputError : ''}`}
                placeholder="Enter login"
              />
              {errors.login && (
                <span className={styles.errorMessage}>
                  {errors.login.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                {...register('password')}
                type="password"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Enter password"
              />
              {errors.password && (
                <span className={styles.errorMessage}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
              value="Login"
            >
              Login
            </button>

            {message && <p className={styles.message}>{message}</p>}
          </fieldset>
        </form>

        <div className={styles.footer}>
          <Link to="/register" className={styles.footerLink}>
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
