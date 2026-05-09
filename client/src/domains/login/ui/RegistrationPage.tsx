import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Auth } from '../../../shared/api/authApi';
import { Link } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import registrationSchema from '../model/validation/registrationSchema';

interface IFormInput {
  login: string;
  password: string;
}

export default function RegistrationPage() {
  const methods = useForm<IFormInput>({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });
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
        <fieldset
          disabled={methods.formState.isSubmitting}
          style={{ border: 'none', padding: 0, margin: 0 }}
        >
          <div>
            <label style={{ margin: 20 }}>Login</label>
            <input
              {...methods.register('login', { required: true, minLength: 2 })}
              placeholder="Login"
            />
            <div>
              {errors.login && (
                <span style={{ color: 'red' }}>{errors.login.message}</span>
              )}
            </div>
          </div>
          <div>
            <label style={{ margin: 20 }}>Password</label>
            <input
              {...methods.register('password', {
                required: true,
                minLength: 2,
              })}
              placeholder="Password"
            />
            <div>
              {errors.password && (
                <span style={{ color: 'red' }}>{errors.password.message}</span>
              )}
            </div>
          </div>
          <input type="submit" />
          <p>{message}</p>
        </fieldset>
        <Link to="/login">Already have an account? Sign in</Link>
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
