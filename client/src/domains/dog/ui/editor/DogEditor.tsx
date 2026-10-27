import { Controller } from 'react-hook-form';
import AnimalEditor from '../../../editor/ui/AnimalEditor';
import type { Dog } from '../../model/dog.interface';
import MultiTagsSelect from '../../../../shared/ui/MultiTagsSelect';
import useAnimalEditor from '../../../editor/model/useAnimalEditor';
import LoadingComponent from '../../../../shared/ui/LoadingComponent';
import DogsApi from '../../api/dogsApi';
import dogEditorSchema from '../../model/validation/dogEditorSchema';
import commonStyles from '../../../editor/ui/css/AnimalEditor.module.css';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export default function DogEditor() {
  const { methods, onSubmit, isLoading, error } = useAnimalEditor<Dog>({
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

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate('/my/cats', { replace: true });
    }
  }, [error]);

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
        isLoading={isLoading}
      />
      {isLoading && (
        <div className={commonStyles.formLoaderOverlay}>
          <LoadingComponent />
        </div>
      )}
    </div>
  );
}
