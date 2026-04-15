import { useState } from 'react';
import { AnimalType } from '../../animal/model/animal.type';
import { CatEditor } from '../../cat/ui/CatEditor';
import { DogEditor } from '../../dog/ui/editor/DogEditor';

type EditorPageMode = 'edit' | 'create';
interface AnimalEditorPageProps {
  mode: EditorPageMode;
}

function AnimalEditorPage({ mode }: AnimalEditorPageProps) {
  const [animalType, setAnimalType] = useState<AnimalType>();
  return (
    <div>
      {mode === 'create' && (
        <div style={{ marginBottom: 20 }}>
          <label>
            <input
              type="radio"
              name="animalType"
              checked={animalType === 'cat'}
              onChange={() => setAnimalType('cat')}
            />
            Cat
          </label>
          <label>
            <input
              type="radio"
              name="animalType"
              checked={animalType === 'dog'}
              onChange={() => setAnimalType('dog')}
            />
            Dog
          </label>
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        {animalType === 'cat' && <CatEditor />}
        {animalType === 'dog' && <DogEditor />}
      </div>
    </div>
  );
}

export default AnimalEditorPage;
