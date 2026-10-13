import styles from './css/MultiTags.module.css';

interface MultiTagsProps {
  elements: string[] | undefined;
}

const MultiTags = ({ elements }: MultiTagsProps) => {
  if (!elements || elements.length === 0) {
    return (
      <span className={`${styles.tag} ${styles.emptyState}`}>No commands</span>
    );
  }

  const maxVisible = 3;
  const visibleElements = elements.slice(0, maxVisible);
  const hiddenCount = elements.length - maxVisible;

  return (
    <div className={styles.tagsContainer}>
      {visibleElements.map((cmd, index) => (
        <span
          key={index}
          className={`${styles.tag} ${styles.commandTag}`}
          title={cmd}
        >
          {cmd}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span
          className={`${styles.tag} ${styles.commandTagMore}`}
          title={elements.slice(maxVisible).join(', ')}
        >
          +{hiddenCount}
        </span>
      )}
    </div>
  );
};

export default MultiTags;
