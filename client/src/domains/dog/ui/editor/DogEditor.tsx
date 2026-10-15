import { Controller } from 'react-hook-form';
import AnimalEditor from '../../../editor/ui/AnimalEditor';
import type { Dog } from '../../model/dog.interface';
import MultiTagsSelect from '../../../../shared/ui/MultiTagsSelect';
import useAnimalEditor from '../../../editor/model/useAnimalEditor';
import LoadingComponent from '../../../../shared/ui/LoadingComponent';
import DogsApi from '../../api/dogsApi';
import dogEditorSchema from '../../model/validation/dogEditorSchema';
import commonStyles from '../../../editor/ui/css/AnimalEditor.module.css';

export default function DogEditor() {
  const { methods, onSubmit, isLoading } = useAnimalEditor<Dog>({
    loadById: DogsApi.getDogById,
    createItem: async (data: Dog) => {
      const { name, birthDate, trainedCommands, description } = data;
      await DogsApi.createDog({
        name,
        birthDate,
        trainedCommands,
        description,
      });
    },
    updateItem: DogsApi.updateDog,
    validationSchema: dogEditorSchema,
    afterSubmit: `/my/dogs`,
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
                  placeholder="Commands..."
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
