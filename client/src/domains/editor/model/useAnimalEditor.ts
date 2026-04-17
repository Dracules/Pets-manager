import { useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { Animal } from '../../animal/model/animal.interface';

type UseAnimalEditorOptions<T> = {
  loadById: (id: string) => Promise<T>;
  createItem: (data: T) => Promise<void>;
  updateItem: (id: string, data: Partial<T>) => Promise<void>;
  afterSubmit: string;
  defaultValues?: DefaultValues<T>;
};

export function useAnimalEditor<T extends Animal>({
  loadById,
  createItem,
  updateItem,
  afterSubmit,
  defaultValues,
}: UseAnimalEditorOptions<T>) {
  const { id } = useParams();
  const methods = useForm<T>(
    defaultValues ? { defaultValues: defaultValues } : {},
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const loadAnimal = async () => {
      const item = await loadById(id);
      if (item) {
        methods.reset(item);
      }
    };

    loadAnimal();
  }, [id, methods]);

  const onSubmit = async (data: T) => {
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
      }
    } else {
      await createItem(data);
    }

    navigate(afterSubmit);
  };

  return { methods, onSubmit };
}
