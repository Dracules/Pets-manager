import {
  Controller,
  FormProvider,
  Path,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { Animal } from '../../animal/model/animal.interface';
import { useNavigate, useParams } from 'react-router';
import { MonthYearPicker } from './MonthYearPicker';

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
  const { id } = useParams();
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
            <label style={{ margin: 20 }}>Birth month</label>
            <Controller
              name={'birthDate' as Path<T>}
              control={methods.control}
              render={({ field }) => (
                <MonthYearPicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    console.log(date);
                    field.onChange(date);
                  }}
                />
              )}
            />
          </div>
          <div>{renderError(methods.formState.errors.birthDate?.message)}</div>
          {fields}
          <input type="submit" value={id ? 'Update' : 'Create'} />
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </fieldset>
      </form>
    </FormProvider>
  );
}
