import {
  FormProvider,
  Path,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { Animal } from '../../animal/model/animal.interface';

interface EditorProps<T extends Animal> {
  onSubmit: SubmitHandler<T>;
  fields: React.ReactNode;
  methods: UseFormReturn<T, any, T>;
}

export function AnimalEditor<T extends Animal>({
  onSubmit,
  fields,
  methods,
}: EditorProps<T>) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div>
          <label style={{ margin: 20 }}>Name</label>
          <input {...methods.register('name' as Path<T>)} placeholder="Name" />
        </div>
        <div>
          <label style={{ margin: 20 }}>Age</label>
          <input
            type="number"
            {...methods.register('age' as Path<T>)}
            placeholder="Age"
          />
        </div>
        {fields}
        <input type="submit" />
      </form>
    </FormProvider>
  );
}
