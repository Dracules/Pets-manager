import { AiOutlineWarning } from 'react-icons/ai';
import styles from './css/ErrorComponent.module.css';

interface InfoErrorComponentProps {
  error: string;
}

interface LoadErrorComponentProps extends InfoErrorComponentProps {
  load: () => void;
  loading: boolean;
}

export function LoadErrorComponent({
  error,
  load,
  loading,
}: LoadErrorComponentProps) {
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
