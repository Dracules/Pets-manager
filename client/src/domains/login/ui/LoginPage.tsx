import { SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
  login: string;
  password: string;
}

export default function LoginPage() {
  const methods = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {};
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
