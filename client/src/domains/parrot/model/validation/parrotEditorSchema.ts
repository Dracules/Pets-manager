import { subYears } from 'date-fns';
import animalEditorSchema, {
  animalBirthDateSchema,
} from '../../../editor/model/validation/animalEditorSchema';

const parrotEditorSchema = animalEditorSchema.shape({
  birthDate: animalBirthDateSchema.min(
    subYears(new Date(), 80),
    'Unfortunately, unrealistic age',
  ),
});

export default parrotEditorSchema;
