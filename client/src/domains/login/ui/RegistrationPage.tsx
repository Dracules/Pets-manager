import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Auth } from '../../../shared/api/authApi';
import { Link } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import registrationSchema from '../model/validation/registrationSchema';
import { RegistrationFormInput } from '../model/form-input.interface';
import styles from './css/AuthPages.module.css';

export default function RegistrationPage() {
  const methods = useForm<RegistrationFormInput>({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      login: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [message, setMessage] = useState('');
  const [isForm, setIsForm] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const errors = methods.formState.errors;

  const onSubmit: SubmitHandler<RegistrationFormInput> = async (data) => {
    setMessage('');
    try {
      const result = await Auth.signUp(data.login, data.password);
      setMessage(result);
      setIsForm(false);
    } catch (e) {
      setMessage('Error: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  if (isForm)
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Create Account</h2>

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

              <div className={styles.field}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  placeholder="Repeat password"
                />
                {errors.confirmPassword && (
                  <span className={styles.errorMessage}>
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                Register
              </button>

              {message && <p className={styles.message}>{message}</p>}
            </fieldset>
          </form>

          <div className={styles.footer}>
            <Link to="/login" className={styles.footerLink}>
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Registration Successful</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.footer}>
          <Link to="/login" className={styles.footerLink}>
            Go to login page
          </Link>
        </div>
      </div>
    </div>
  );
}
