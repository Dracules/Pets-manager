import { SubmitHandler, useForm } from 'react-hook-form';
import { Auth } from '../../../shared/api/apiClient';

interface IFormInput {
  login: string;
  password: string;
}

export default function LoginPage() {
  const methods = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const result = await Auth.signIn(data.login, data.password);
    localStorage.setItem('jwtToken', result.access_token);
  };
  return (
    <div>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <label>Login</label>
        <input
          {...methods.register('login', { required: true, minLength: 2 })}
          placeholder="Login"
        />
        <label>Password</label>
        <input
          {...methods.register('password', { required: true, minLength: 2 })}
          placeholder="Password"
        />
        <input type="submit" />
      </form>
    </div>
  );
}
