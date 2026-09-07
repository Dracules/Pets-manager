import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Auth } from '../../../shared/api/authApi';
import { yupResolver } from '@hookform/resolvers/yup';
import registrationSchema from '../model/validation/registrationSchema';
import { RegistrationFormInput } from '../model/form-input.interface';
import styles from './css/AuthPages.module.css';
import { FormField } from './FormField';
import { AuthLayout } from './AuthLayout';
import { SubmitButton } from './SubmitButton';

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
      <AuthLayout
        title={'Create Account'}
        message={message}
        footerLink={{ to: '/login', text: 'Already have an account? Sign in' }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
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
            <FormField
              label={'Confirm Password'}
              name={'confirmPassword'}
              type={'password'}
              placeholder={'Repeat password'}
              register={register}
              error={errors.confirmPassword}
            />
            <SubmitButton title={'Register'} isSubmitting={isSubmitting} />
          </fieldset>
        </form>
      </AuthLayout>
    );

  return (
    <AuthLayout
      title={'Registration Successful'}
      message={message}
      footerLink={{ to: '/login', text: 'Go to login page' }}
    />
  );
}
