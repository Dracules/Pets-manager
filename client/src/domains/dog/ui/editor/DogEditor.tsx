import { useForm } from 'react-hook-form';
import { AnimalEditor } from '../../../editor/ui/AnimalEditor';
import { Dog } from '../../model/dog.interface';
import { createDog } from '../../../../shared/api/apiClient';

export function DogEditor() {
  const methods = useForm<Dog>();

  return (
    <AnimalEditor<Dog>
      fields={<div></div>}
      onSubmit={async (data) => {
        const { name, age, trainedCommands } = data;
        const result = await createDog({ name, age, trainedCommands });
        console.log(`Dog created: ${JSON.stringify(result)}`);
      }}
      methods={methods}
    />
  );
}
