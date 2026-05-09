import { SubmitHandler, useForm } from 'react-hook-form';
import { isApiError } from '../../../shared/api/apiClient';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Auth } from '../../../shared/api/authApi';
import { Link } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from '../model/validation/loginSchema';
import { LoginFormInput } from '../model/form-input.interface';

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
  return token.access_token ? (
    <h3>You have already been athorized!</h3>
  ) : (
    <div>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <fieldset
          disabled={methods.formState.isSubmitting}
          style={{ border: 'none', padding: 0, margin: 0 }}
        >
          <div>
            <label style={{ margin: 20 }}>Login</label>
            <input {...methods.register('login')} placeholder="Login" />
            <div>
              {errors.login && (
                <span style={{ color: 'red' }}>{errors.login.message}</span>
              )}
            </div>
          </div>
          <div>
            <label style={{ margin: 20 }}>Password</label>
            <input {...methods.register('password')} placeholder="Password" />
            <div>
              {errors.password && (
                <span style={{ color: 'red' }}>{errors.password.message}</span>
              )}
            </div>
          </div>
          <input type="submit" value="Login" />
          <p>{message}</p>
        </fieldset>
      </form>
      <div>
        <Link to="/register">Don’t have an account? Sign up</Link>
      </div>
    </div>
  );
}
