import { Controller } from 'react-hook-form';
import AnimalEditor from '../../../editor/ui/AnimalEditor';
import type { Parrot } from '../../model/parrot.interface';
import MultiTagsSelect from '../../../../shared/ui/MultiTagsSelect';
import useAnimalEditor from '../../../editor/model/useAnimalEditor';
import LoadingComponent from '../../../../shared/ui/LoadingComponent';
import ParrotsApi from '../../api/parrotsApi';
import parrotEditorSchema from '../../model/validation/parrotEditorSchema';
import commonStyles from '../../../editor/ui/css/AnimalEditor.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export default function ParrotEditor() {
  const { methods, onSubmit, isLoading, error } = useAnimalEditor<Parrot>({
    loadById: ParrotsApi.getParrotById,
    createItem: async (data: Parrot) => {
      const { name, birthDate, vocabulary, description } = data;
      await ParrotsApi.createParrot({
        name,
        birthDate,
        vocabulary,
        description,
      });
    },
    updateItem: ParrotsApi.updateParrot,
    validationSchema: parrotEditorSchema,
    afterSubmit: `/my/parrots`,
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
      <AnimalEditor<Parrot>
        fields={
          <div className={commonStyles.field}>
            <label className={commonStyles.label}>Parrot vocabulary</label>
            <Controller
              name="vocabulary"
              control={methods.control}
              render={({ field }) => (
                <MultiTagsSelect
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Known words..."
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
