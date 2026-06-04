import { useState } from 'react';
import { AnimalType } from '../../animal/model/animal.type';
import { CatEditor } from '../../cat/ui/CatEditor';
import { DogEditor } from '../../dog/ui/editor/DogEditor';
import { useSearchParams } from 'react-router';
import styles from './css/AnimalEditorPage.module.css';
import { PiCat, PiDog } from 'react-icons/pi';
import { GiParrotHead } from 'react-icons/gi';
import { ParrotEditor } from '../../parrot/ui/editor/ParrotEditor';

type EditorPageMode = 'edit' | 'create';
interface AnimalEditorPageProps {
  mode: EditorPageMode;
}

function AnimalEditorPage({ mode }: AnimalEditorPageProps) {
  const [animalType, setAnimalType] = useState<AnimalType>('cat');
  const [searchParams] = useSearchParams();

  const currentType: AnimalType =
    mode === 'edit' ? (searchParams.get('type') as AnimalType) : animalType;
  return (
    <div>
      {mode === 'create' && (
        <div className={styles.animalTypeSelector}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="animalType"
              checked={currentType === 'cat'}
              onChange={() => setAnimalType('cat')}
              className={styles.radioInput}
            />
            <PiCat className={styles.radioIcon} />
            <span>Cat</span>
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="animalType"
              checked={currentType === 'dog'}
              onChange={() => setAnimalType('dog')}
              className={styles.radioInput}
            />
            <PiDog className={styles.radioIcon} />
            <span>Dog</span>
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="animalType"
              checked={currentType === 'parrot'}
              onChange={() => setAnimalType('parrot')}
              className={styles.radioInput}
            />
            <GiParrotHead className={styles.radioIcon} />
            <span>Parrot</span>
          </label>
        </div>
      )}

      <div className={styles.editorWrapper}>
        {currentType === 'cat' && <CatEditor />}
        {currentType === 'dog' && <DogEditor />}
        {currentType === 'parrot' && <ParrotEditor />}
      </div>
    </div>
  );
}

export default AnimalEditorPage;
