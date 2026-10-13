import { Cat } from '../model/cat.interface';
import { LITTER_STATUS } from '../model/litterStatus.type';
import AnimalEditor from '../../editor/ui/AnimalEditor';
import useAnimalEditor from '../../editor/model/useAnimalEditor';
import LoadingComponent from '../../../shared/ui/LoadingComponent';
import CatsApi from '../api/catsApi';
import catEditorSchema from '../model/validation/catEditorSchema';
import commonStyles from '../../editor/ui/css/AnimalEditor.module.css';
import specialStyles from './css/CatEditor.module.css';
import { FiChevronDown } from 'react-icons/fi';

export default function CatEditor() {
  const { methods, onSubmit, isLoading } = useAnimalEditor<Cat>({
    loadById: CatsApi.getCatById,
    createItem: async (data: Cat) => {
      const { name, birthDate, litterStatus, description } = data;
      await CatsApi.createCat({ name, birthDate, litterStatus, description });
    },
    updateItem: CatsApi.updateCat,
    afterSubmit: `/my/cats`,
    validationSchema: catEditorSchema,
    defaultValues: { litterStatus: 'unknown' },
  });

  return (
    <div className={commonStyles.formContainer}>
      <AnimalEditor<Cat>
        fields={
          <div className={commonStyles.field}>
            <label className={commonStyles.label}>Litter status</label>
            <div className={specialStyles.selectWrapper}>
              <select
                {...methods.register('litterStatus')}
                className={`${commonStyles.input} ${specialStyles.customSelect}`}
              >
                {LITTER_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <FiChevronDown className={specialStyles.arrowIcon} />
            </div>
            {methods.formState.errors.litterStatus && (
              <div className={commonStyles.errorMessage}>
                {methods.formState.errors.litterStatus.message}
              </div>
            )}
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
