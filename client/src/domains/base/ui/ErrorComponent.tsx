import { AiOutlineWarning } from 'react-icons/ai';
import styles from './css/ErrorComponent.module.css';

interface ErrorComponentProps {
  error: string;
  load: () => void;
  loading: boolean;
}

export function ErrorComponent({ error, load, loading }: ErrorComponentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <AiOutlineWarning />
        </div>
        <p className={styles.errorText}>Failed to load data</p>
        <p className={styles.errorHint}>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => {
            console.log('Click');
            load();
          }}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.loadingText}>Loading</span>
          ) : (
            'Repeat request'
          )}
        </button>
      </div>
    </div>
  );
}
