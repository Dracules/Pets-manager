import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Auth } from '../../../shared/api/authApi';
import { Link } from 'react-router';

interface IFormInput {
  login: string;
  password: string;
}

export default function RegistrationPage() {
  const methods = useForm<IFormInput>();
  const [message, setMessage] = useState('');
  const [isForm, setIsForm] = useState(true);

  const errors = methods.formState.errors;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setMessage('');
    try {
      const result = await Auth.signUp(data.login, data.password);
      setMessage(result);
      setIsForm(false);
    } catch (e) {
      setMessage('Error: ' + e);
    }
  };

  return isForm ? (
    <>
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
    </>
  ) : (
    <>
      <h3>{message}</h3>
      <div>
        <Link to="/login">Go to login page</Link>
      </div>
    </>
  );
}
