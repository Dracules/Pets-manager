import { useForm } from 'react-hook-form';
import {
  createCat,
  getCatById,
  updateCat,
} from '../../../shared/api/apiClient';
import { Cat } from '../model/cat.interface';
import { LITTER_STATUS } from '../model/litterStatus.type';
import { AnimalEditor } from '../../editor/ui/AnimalEditor';
import { useParams } from 'react-router';
import { useEffect } from 'react';

export function CatEditor() {
  const { id } = useParams();
  const methods = useForm<Cat>({ defaultValues: { litterStatus: 'unknown' } });

  useEffect(() => {
    const loadCat = async () => {
      if (!id) return;
      const cat = await getCatById(id);
      if (cat) {
        methods.reset(cat);
      }
    };

    loadCat();
  }, [id, methods]);

  const onSubmit = id
    ? async (data: Cat) => {
        if (Object.keys(methods.formState.dirtyFields).length !== 0) {
          const changedFields = Object.fromEntries(
            Object.entries(data).filter(
              ([key]) => methods.formState.dirtyFields[key as keyof Cat],
            ),
          );
          await updateCat(id, changedFields);
        }
      }
    : async (data: Cat) => {
        const { name, age, litterStatus } = data;
        await createCat({ name, age, litterStatus });
      };

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
