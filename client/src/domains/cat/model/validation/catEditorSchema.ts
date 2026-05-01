import * as yup from 'yup';
import animalEditorSchema, {
  animalAgeSchema,
} from '../../../editor/model/validation/animalEditorSchema';
import { LITTER_STATUS } from '../litterStatus.type';

const catEditorSchema = animalEditorSchema.shape({
  age: animalAgeSchema.max(40, 'Unfortunately, unrealistic age'),

  litterStatus: yup
    .string()
    .oneOf(LITTER_STATUS)
    .required('Please choose status'),
});

export default catEditorSchema;
