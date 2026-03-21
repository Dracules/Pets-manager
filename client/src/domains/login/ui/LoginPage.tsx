import { SubmitHandler, useForm } from 'react-hook-form';
import { Auth, isApiError } from '../../../shared/api/apiClient';
import { useState } from 'react';

interface IFormInput {
  login: string;
  password: string;
}

export default function LoginPage() {
  const methods = useForm<IFormInput>();
  const [message, setMessage] = useState('');

  const errors = methods.formState.errors;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const result = await Auth.signIn(data.login, data.password);
      if (result.access_token) {
        localStorage.setItem('jwtToken', result.access_token);
        setMessage('Successfull enter!');
      } else setMessage('Something wrong!');
    } catch (e) {
      if (isApiError(e) && e.response?.status === 401) {
        setMessage('Wrong login or password!');
      } else {
        setMessage('Error: ' + e);
      }
    }
  };
  return (
    <div>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <label>Login</label>
        <input
          {...methods.register('login', { required: true, minLength: 2 })}
          placeholder="Login"
        />
        {errors.login?.type === 'required' && (
          <span>Login field is required!</span>
        )}
        {errors.login?.type === 'minLength' && (
          <span>Minimal login length is 2!</span>
        )}
        <label>Password</label>
        <input
          {...methods.register('password', { required: true, minLength: 2 })}
          placeholder="Password"
        />

        {errors.password?.type === 'required' && (
          <span>Password field is required!</span>
        )}
        {errors.password?.type === 'minLength' && (
          <span>Minimal password length is 2!</span>
        )}
        <input type="submit" />
        <p>{message}</p>
      </form>
    </div>
  );
}
