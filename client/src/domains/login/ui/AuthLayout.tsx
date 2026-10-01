import { ReactNode } from 'react';
import styles from './css/AuthPages.module.css';
import { Link } from 'react-router';

interface AuthLayoutProps {
  title: string;
  children?: ReactNode;
  footerLink?: { to: string; text: string };
  message?: { text: string; error: boolean };
}

export const AuthLayout = ({
  title,
  children,
  footerLink,
  message,
}: AuthLayoutProps) => (
  <div className={styles.container}>
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>

      {children}

      {message && (
        <p
          className={`${styles.authLayoutMessage} ${message.error ? styles.authLayoutMessageError : ''}`}
        >
          {message.text}
        </p>
      )}

      {footerLink && (
        <div className={styles.footer}>
          <Link to={footerLink.to} className={styles.footerLink}>
            {footerLink.text}
          </Link>
        </div>
      )}
    </div>
  </div>
);
