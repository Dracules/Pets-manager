import { Controller, useForm } from 'react-hook-form';
import { AnimalEditor } from '../../../editor/ui/AnimalEditor';
import { Dog } from '../../model/dog.interface';
import { MultiTagsSelect } from './MultiTagsSelect';
import { createDog } from '../../../../shared/api/apiClient';

export function DogEditor() {
  const methods = useForm<Dog>();

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
      onSubmit={async (data) => {
        const { name, age, trainedCommands } = data;
        const result = await createDog({ name, age, trainedCommands });
        console.log(`Dog created: ${JSON.stringify(result)}`);
      }}
      methods={methods}
    />
  );
}
