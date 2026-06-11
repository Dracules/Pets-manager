import { UseFormRegister, FieldError } from 'react-hook-form';
import styles from './css/AuthPages.module.css';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error: FieldError | undefined;
}

export const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
}: FormFieldProps) => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        {...register(name)}
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        placeholder={placeholder}
      />
      {error && <span className={styles.errorMessage}>{error.message}</span>}
    </div>
  );
};
