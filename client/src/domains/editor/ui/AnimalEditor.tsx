import {
  Controller,
  FormProvider,
  Path,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import type { Animal } from '../../animal/model/animal.interface';
import { useNavigate, useParams } from 'react-router';
import MonthYearPicker from './MonthYearPicker';
import styles from './css/AnimalEditor.module.css';

interface EditorProps<T extends Animal> {
  onSubmit: SubmitHandler<T>;
  fields: React.ReactNode;
  methods: UseFormReturn<T, any, T>;
  isLoading: boolean;
}

const renderError = (message?: unknown) =>
  typeof message === 'string' ? (
    <span className={styles.errorMessage}>{message}</span>
  ) : null;

export default function AnimalEditor<T extends Animal>({
  onSubmit,
  fields,
  methods,
  isLoading,
}: EditorProps<T>) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isSubmitting = methods.formState.isSubmitting;
  const errors = methods.formState.errors;

  return (
    <div className={styles.formCard}>
      <FormProvider {...methods}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <fieldset
            disabled={isSubmitting || isLoading}
            className={styles.fieldset}
          >
            <div className={styles.field}>
              <label className={`${styles.label} ${styles.labelRequired}`}>
                Name
              </label>
              <input
                {...methods.register('name' as Path<T>)}
                placeholder="Enter name"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              />
              <div>{renderError(errors.name?.message)}</div>
            </div>
            <div className={styles.field}>
              <label className={`${styles.label} ${styles.labelRequired}`}>
                Birth month
              </label>
              <div>
                <Controller
                  name={'birthDate' as Path<T>}
                  control={methods.control}
                  render={({ field }) => (
                    <MonthYearPicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              </div>
              <div>{renderError(errors.birthDate?.message)}</div>
            </div>
            {fields}
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                {...methods.register('description' as Path<T>)}
                placeholder="Enter description"
                maxLength={1000}
                rows={4}
                className={`${styles.input} ${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              />
              <div>{renderError(errors.description?.message)}</div>
            </div>

            <div className={styles.actions}>
              <input
                type="submit"
                className={`${styles.button} ${styles.submitButton}`}
                value={isSubmitting ? 'Saving...' : id ? 'Update' : 'Create'}
              />

              <button
                type="button"
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => void navigate(-1)}
                disabled={isSubmitting || isLoading}
              >
                Cancel
              </button>
            </div>
          </fieldset>
        </form>
      </FormProvider>
    </div>
  );
}
