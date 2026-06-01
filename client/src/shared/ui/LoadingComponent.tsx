import { ClipLoader } from 'react-spinners';
import styles from './css/LoadingComponent.module.css';

export default function LoadingComponent() {
  return (
    <ClipLoader
      color="var(--blue-active)"
      size={70}
      speedMultiplier={0.5}
      className={styles.customLoader}
    />
  );
}
