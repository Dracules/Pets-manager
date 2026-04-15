import { Controller, useForm } from 'react-hook-form';
import { AnimalEditor } from '../../../editor/ui/AnimalEditor';
import { Dog } from '../../model/dog.interface';
import { MultiTagsSelect } from './MultiTagsSelect';
import {
  createDog,
  getDogById,
  updateDog,
} from '../../../../shared/api/apiClient';
import { useParams } from 'react-router';
import { useEffect } from 'react';

export function DogEditor() {
  const methods = useForm<Dog>();
  const { id } = useParams();

  useEffect(() => {
    const loadDog = async () => {
      if (!id) return;
      const dog = await getDogById(id);
      if (dog) {
        methods.reset(dog);
      }
    };

    loadDog();
  }, [id, methods]);

  const onSubmit = id
    ? async (data: Dog) => {
        if (Object.keys(methods.formState.dirtyFields).length !== 0) {
          const changedFields = Object.fromEntries(
            Object.entries(data).filter(
              ([key]) => methods.formState.dirtyFields[key as keyof Dog],
            ),
          );
          await updateDog(id, changedFields);
        }
      }
    : async (data: Dog) => {
        const { name, age, trainedCommands } = data;
        await createDog({ name, age, trainedCommands });
      };

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
