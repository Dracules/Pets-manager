import { Controller } from 'react-hook-form';
import AnimalEditor from '../../../editor/ui/AnimalEditor';
import { Parrot } from '../../model/parrot.interface';
import MultiTagsSelect from '../../../../shared/ui/MultiTagsSelect';
import useAnimalEditor from '../../../editor/model/useAnimalEditor';
import LoadingComponent from '../../../../shared/ui/LoadingComponent';
import ParrotsApi from '../../api/parrotsApi';
import parrotEditorSchema from '../../model/validation/parrotEditorSchema';
import commonStyles from '../../../editor/ui/css/AnimalEditor.module.css';

export default function ParrotEditor() {
  const { methods, onSubmit, isLoading } = useAnimalEditor<Parrot>({
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
      />
      {isLoading && (
        <div className={commonStyles.formLoaderOverlay}>
          <LoadingComponent />
        </div>
      )}
    </div>
  );
}
