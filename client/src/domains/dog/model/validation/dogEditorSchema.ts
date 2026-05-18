import { subYears } from 'date-fns';
import animalEditorSchema, {
  animalBirthDateSchema,
} from '../../../editor/model/validation/animalEditorSchema';

const dogEditorSchema = animalEditorSchema.shape({
  birthDate: animalBirthDateSchema.min(
    subYears(new Date(), 30),
    'Unfortunately, unrealistic age',
  ),
});

export default dogEditorSchema;
