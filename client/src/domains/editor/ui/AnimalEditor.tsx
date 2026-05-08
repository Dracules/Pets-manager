import {
  FormProvider,
  Path,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { Animal } from '../../animal/model/animal.interface';
import { useNavigate } from 'react-router';

interface EditorProps<T extends Animal> {
  onSubmit: SubmitHandler<T>;
  fields: React.ReactNode;
  methods: UseFormReturn<T, any, T>;
}

const renderError = (message?: unknown) =>
  typeof message === 'string' ? (
    <span style={{ color: 'red' }}>{message}</span>
  ) : null;

export function AnimalEditor<T extends Animal>({
  onSubmit,
  fields,
  methods,
}: EditorProps<T>) {
  const navigate = useNavigate();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <fieldset
          disabled={methods.formState.isSubmitting}
          style={{ border: 'none', padding: 0, margin: 0 }}
        >
          <div>
            <label style={{ margin: 20 }}>Name</label>
            <input
              {...methods.register('name' as Path<T>)}
              placeholder="Name"
            />
          </div>
          <div>{renderError(methods.formState.errors.name?.message)}</div>
          <div>
            <label style={{ margin: 20 }}>Age</label>
            <input
              type="number"
              {...methods.register('age' as Path<T>, {
                valueAsNumber: true,
              })}
              placeholder="Age"
            />
          </div>
          <div>{renderError(methods.formState.errors.age?.message)}</div>
          {fields}
          <input type="submit" />
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </fieldset>
      </form>
    </FormProvider>
  );
}
