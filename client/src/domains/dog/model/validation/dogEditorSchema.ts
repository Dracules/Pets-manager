import animalEditorSchema, {
  animalAgeSchema,
} from '../../../editor/model/validation/animalEditorSchema';

const dogEditorSchema = animalEditorSchema.shape({
  age: animalAgeSchema.max(30, 'Unfortunately, unrealistic age'),
});

export default dogEditorSchema;
