import { AiOutlineWarning } from 'react-icons/ai';

interface ErrorComponentProps {
  error: string;
  load: () => void;
}

export function ErrorComponent({ error, load }: ErrorComponentProps) {
  return (
    <>
      <AiOutlineWarning />
      <p>Failed to load data</p>
      <p>{error}</p>
      <button
        onClick={() => {
          console.log('Click');
          load();
        }}
      >
        'Repeat request'
      </button>
    </>
  );
}
