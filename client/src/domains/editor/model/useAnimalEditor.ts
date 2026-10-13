import { useEffect, useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { Animal } from '../../animal/model/animal.interface';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type UseAnimalEditorOptions<T> = {
  loadById: (id: string) => Promise<T>;
  createItem: (data: T) => Promise<void>;
  updateItem: (id: string, data: Partial<T>) => Promise<void>;
  afterSubmit: string;
  validationSchema: yup.AnyObjectSchema;
  defaultValues?: DefaultValues<T>;
};

export default function useAnimalEditor<T extends Animal>({
  loadById,
  createItem,
  updateItem,
  afterSubmit,
  validationSchema,
  defaultValues,
}: UseAnimalEditorOptions<T>) {
  const { id } = useParams();
  const methods = useForm<T>({
    resolver: yupResolver(validationSchema),
    ...(defaultValues ? { defaultValues } : {}),
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(id ? true : false);

  useEffect(() => {
    if (!id) return;

    const loadAnimal = async () => {
      setIsLoading(true);
      const item = await loadById(id);
      if (item) {
        methods.reset(item);
        setIsLoading(false);
      }
    };

    void loadAnimal();
  }, [id, methods]);

  const onSubmit = async (data: T) => {
    const toastId = toast.loading(id ? 'Updating...' : 'Creating...');
    try {
      if (id) {
        const dirtyKeys = Object.keys(methods.formState.dirtyFields);
        if (dirtyKeys.length !== 0) {
          const dirtyFields = methods.formState.dirtyFields as Partial<
            Record<keyof T, boolean>
          >;

          const changedFields = Object.fromEntries(
            Object.entries(data).filter(([key]) => dirtyFields[key as keyof T]),
          ) as Partial<T>;

          await updateItem(id, changedFields);
          toast.success(`Animal ${data.name} updated!`);
        } else {
          toast.error(`Error: nothing is changed!`);
          return;
        }
      } else {
        await createItem(data);
        toast.success(`Animal ${data.name} created!`);
      }
      void navigate(afterSubmit);
    } catch {
      toast.error(id ? 'Update failed!' : 'Creation failed!');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return { methods, onSubmit, isLoading };
}
