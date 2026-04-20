import { Controller } from 'react-hook-form';
import { AnimalEditor } from '../../../editor/ui/AnimalEditor';
import { Dog } from '../../model/dog.interface';
import { MultiTagsSelect } from './MultiTagsSelect';
import {
  createDog,
  getDogById,
  updateDog,
} from '../../../../shared/api/apiClient';
import { useAnimalEditor } from '../../../editor/model/useAnimalEditor';

export function DogEditor() {
  const { methods, onSubmit } = useAnimalEditor<Dog>({
    loadById: getDogById,
    createItem: async (data: Dog) => {
      const { name, age, trainedCommands } = data;
      await createDog({ name, age, trainedCommands });
    },
    updateItem: updateDog,
    afterSubmit: `/mydogs`,
  });
  return (
    <AnimalEditor<Dog>
      fields={
        <div style={{ marginLeft: 20, width: '30%' }}>
          <label>Trained commands</label>
          <Controller
            name="trainedCommands"
            control={methods.control}
            render={({ field }) => (
              <MultiTagsSelect value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      }
      onSubmit={onSubmit}
      methods={methods}
    />
  );
}
