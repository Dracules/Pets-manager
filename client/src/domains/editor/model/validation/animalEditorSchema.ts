import * as yup from 'yup';

export const animalAgeSchema = yup
  .number()
  .transform((value, originalValue) =>
    originalValue === '' || Number.isNaN(value) ? undefined : value,
  )
  .required('Please enter an age')
  .integer('Age must be a whole number')
  .min(0, 'Age must be 0 or greater');

const animalEditorSchema = yup.object({
  name: yup
    .string()
    .required('Please enter a name')
    .min(2, 'Name must contain at least 2 characters')
    .max(50, 'Name is too long'),

  age: animalAgeSchema,
});

export default animalEditorSchema;
