import { SubmitHandler, useForm } from 'react-hook-form';
import { isApiError } from '../../../shared/api/apiClient';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Auth } from '../../../shared/api/authApi';

interface IFormInput {
  login: string;
  password: string;
}

export default function LoginPage() {
  const methods = useForm<IFormInput>();
  const [message, setMessage] = useState('');
  const { token, login } = useAuth();

  const errors = methods.formState.errors;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const result = await Auth.signIn(data.login, data.password);
      if (result.access_token) {
        login(result.access_token);
      } else setMessage('Something wrong!');
    } catch (e) {
      if (isApiError(e) && e.response?.status === 401) {
        setMessage('Wrong login or password!');
      } else {
        setMessage('Error: ' + e);
      }
    }
  };
  return token ? (
    <h3>You have already been athorized!</h3>
  ) : (
    <div>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div>
          <label style={{ margin: 20 }}>Login</label>
          <input
            {...methods.register('login', { required: true, minLength: 2 })}
            placeholder="Login"
          />
          <div>
            {errors.login?.type === 'required' && (
              <span>Login field is required!</span>
            )}
            {errors.login?.type === 'minLength' && (
              <span>Minimal login length is 2!</span>
            )}
          </div>
        </div>
        <div>
          <label style={{ margin: 20 }}>Password</label>
          <input
            {...methods.register('password', { required: true, minLength: 2 })}
            placeholder="Password"
          />
          <div>
            {errors.password?.type === 'required' && (
              <span>Password field is required!</span>
            )}
            {errors.password?.type === 'minLength' && (
              <span>Minimal password length is 2!</span>
            )}
          </div>
        </div>
        <input type="submit" />
        <p>{message}</p>
      </form>
    </div>
  );
}
