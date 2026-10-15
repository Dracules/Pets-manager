import styles from './css/AuthPages.module.css';

interface SubmitButtonProps {
  title: string;
  isSubmitting: boolean;
}

const SubmitButton = ({ title, isSubmitting }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={styles.submitButton}
      disabled={isSubmitting}
    >
      {title}
    </button>
  );
};

export default SubmitButton;
