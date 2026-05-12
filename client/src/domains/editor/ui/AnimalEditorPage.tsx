import { useEffect, useState } from 'react';
import { AnimalType } from '../../animal/model/animal.type';
import { CatEditor } from '../../cat/ui/CatEditor';
import { DogEditor } from '../../dog/ui/editor/DogEditor';
import { useSearchParams } from 'react-router';

type EditorPageMode = 'edit' | 'create';
interface AnimalEditorPageProps {
  mode: EditorPageMode;
}

function AnimalEditorPage({ mode }: AnimalEditorPageProps) {
  const [animalType, setAnimalType] = useState<AnimalType>('cat');
  const [searchParams] = useSearchParams();

  const currentType: AnimalType =
    mode === 'edit'
      ? searchParams.get('type') === 'dog'
        ? 'dog'
        : 'cat'
      : animalType;

  return (
    <div>
      {mode === 'create' && (
        <div style={{ marginBottom: 20 }}>
          <label>
            <input
              type="radio"
              name="animalType"
              checked={currentType === 'cat'}
              onChange={() => setAnimalType('cat')}
            />
            Cat
          </label>
          <label>
            <input
              type="radio"
              name="animalType"
              checked={currentType === 'dog'}
              onChange={() => setAnimalType('dog')}
            />
            Dog
          </label>
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        {currentType === 'cat' && <CatEditor />}
        {currentType === 'dog' && <DogEditor />}
      </div>
    </div>
  );
}

export default AnimalEditorPage;
