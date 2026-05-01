import { Cat } from '../model/cat.interface';
import { LITTER_STATUS } from '../model/litterStatus.type';
import { AnimalEditor } from '../../editor/ui/AnimalEditor';
import { useAnimalEditor } from '../../editor/model/useAnimalEditor';
import LoadingComponent from '../../../shared/ui/LoadingComponent';
import { CatsApi } from '../api/catsApi';

export function CatEditor() {
  const { methods, onSubmit, isLoading } = useAnimalEditor<Cat>({
    loadById: CatsApi.getCatById,
    createItem: async (data: Cat) => {
      const { name, age, litterStatus } = data;
      await CatsApi.createCat({ name, age, litterStatus });
    },
    updateItem: CatsApi.updateCat,
    afterSubmit: `/mycats`,
    defaultValues: { litterStatus: 'unknown' },
  });

  if (isLoading) return <LoadingComponent />;
  return (
    <AnimalEditor<Cat>
      fields={
        <div>
          <label style={{ margin: 20 }}>Litter status</label>
          <select {...methods.register('litterStatus')}>
            {LITTER_STATUS.map((status) => (
              <option key={status} value={status}>
                {status === 'unknown'
                  ? 'Choose status'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      }
      onSubmit={onSubmit}
      methods={methods}
    />
  );
}
