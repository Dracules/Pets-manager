import { Controller } from 'react-hook-form';
import { AnimalEditor } from '../../../editor/ui/AnimalEditor';
import { Dog } from '../../model/dog.interface';
import { MultiTagsSelect } from './MultiTagsSelect';
import { useAnimalEditor } from '../../../editor/model/useAnimalEditor';
import LoadingComponent from '../../../../shared/ui/LoadingComponent';
import { DogsApi } from '../../api/dogsApi';
import dogEditorSchema from '../../model/validation/dogEditorSchema';
import commonStyles from '../../../editor/ui/css/AnimalEditor.module.css';

export function DogEditor() {
  const { methods, onSubmit, isLoading } = useAnimalEditor<Dog>({
    loadById: DogsApi.getDogById,
    createItem: async (data: Dog) => {
      const { name, birthDate, trainedCommands } = data;
      await DogsApi.createDog({ name, birthDate, trainedCommands });
    },
    updateItem: DogsApi.updateDog,
    validationSchema: dogEditorSchema,
    afterSubmit: `/mydogs`,
  });
  return (
    <div className={commonStyles.formContainer}>
      <AnimalEditor<Dog>
        fields={
          <div className={commonStyles.field}>
            <label className={commonStyles.label}>Trained commands</label>
            <Controller
              name="trainedCommands"
              control={methods.control}
              render={({ field }) => (
                <MultiTagsSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        }
        onSubmit={onSubmit}
        methods={methods}
      />
      {isLoading && (
        <div className={commonStyles.formLoaderOverlay}>
          <LoadingComponent />
        </div>
      )}
    </div>
  );
}
