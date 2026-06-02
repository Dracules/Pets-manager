import * as yup from 'yup';

export const animalBirthDateSchema = yup
  .date()
  .required('Please enter a birth month')
  .max(new Date(), "Date can't be in the future");

const animalEditorSchema = yup.object({
  name: yup
    .string()
    .required('Please enter a name')
    .min(2, 'Name must contain at least 2 characters')
    .max(50, 'Name is too long'),

  birthDate: animalBirthDateSchema,

  description: yup
    .string()
    .trim()
    .min(1, 'Please, enter a valid description')
    .max(1000, 'Description is too long'),
});

export default animalEditorSchema;
