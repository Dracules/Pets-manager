import {
  createCat,
  getCatById,
  updateCat,
} from '../../../shared/api/apiClient';
import { Cat } from '../model/cat.interface';
import { LITTER_STATUS } from '../model/litterStatus.type';
import { AnimalEditor } from '../../editor/ui/AnimalEditor';
import { useAnimalEditor } from '../../editor/model/useAnimalEditor';

export function CatEditor() {
  const { methods, onSubmit } = useAnimalEditor<Cat>({
    loadById: getCatById,
    createItem: async (data: Cat) => {
      const { name, age, litterStatus } = data;
      await createCat({ name, age, litterStatus });
    },
    updateItem: updateCat,
    afterSubmit: `/mycats`,
    defaultValues: { litterStatus: 'unknown' },
  });

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
