import { useForm } from 'react-hook-form';
import { createCat } from '../../../shared/api/apiClient';
import { Cat } from '../model/cat.interface';
import { LITTER_STATUS } from '../model/litterStatus.type';
import { AnimalEditor } from '../../editor/ui/AnimalEditor';

export function CatEditor() {
  const methods = useForm<Cat>();

  return (
    <AnimalEditor<Cat>
      fields={
        <div>
          <label style={{ margin: 20 }}>Litter status</label>
          <select {...methods.register('litterStatus')} defaultValue="unknown">
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
