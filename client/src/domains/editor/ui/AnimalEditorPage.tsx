import { useState } from 'react';
import { AnimalType } from '../../animal/model/animal.type';
import { CatEditor } from '../../cat/ui/CatEditor';

function AnimalEditorPage() {
  const [animalType, setAnimalType] = useState<AnimalType>('cat');
  return (
    <div>
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

      {animalType === 'cat' && <CatEditor />}
    </div>
  );
}

export default AnimalEditorPage;
