import * as yup from 'yup';
import animalEditorSchema, {
  animalBirthDateSchema,
} from '../../../editor/model/validation/animalEditorSchema';
import { LITTER_STATUS } from '../litterStatus.type';
import { subYears } from 'date-fns';

const catEditorSchema = animalEditorSchema.shape({
  birthDate: animalBirthDateSchema.min(
    subYears(new Date(), 40),
    'Unfortunately, unrealistic age',
  ),

  litterStatus: yup
    .string()
    .oneOf(LITTER_STATUS)
    .required('Please choose status'),
});

export default catEditorSchema;
