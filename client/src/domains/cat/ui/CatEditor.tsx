import { useForm } from 'react-hook-form';
import {
  getCatById,
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
      onSubmit={async (data) => {
        const { name, age, litterStatus } = data;
        const result = await createCat({ name, age, litterStatus });
        console.log(`Cat created: ${JSON.stringify(result)}`);
      }}
      methods={methods}
    />
  );
}
