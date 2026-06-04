import CreatableSelect from 'react-select/creatable';
import './css/MultiTagsSelect.module.css';

type Option = {
  readonly value: string;
  readonly label: string;
};

interface MultiTagsSelectProps {
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
  placeholder: string;
}

export function MultiTagsSelect({
  value = [],
  onChange,
  placeholder,
}: MultiTagsSelectProps) {
  const selectValue: readonly Option[] = value.map((element) => ({
    value: element,
    label: element,
  }));

  function capitalizeFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  return (
    <CreatableSelect<Option, true>
      classNamePrefix="multi-tags"
      value={selectValue}
      onChange={(newValue) => {
        const stringValues = newValue?.length
          ? newValue.map((element) => capitalizeFirstLetter(element.value))
          : undefined;
        onChange(stringValues);
      }}
      isMulti
      isClearable
      placeholder={placeholder}
      formatCreateLabel={(input) => {
        const formatted = capitalizeFirstLetter(input);
        return `Add "${formatted}"`;
      }}
      isValidNewOption={(input) => {
        const normalizedInput = capitalizeFirstLetter(input);

        const exists = selectValue.some((option) => {
          return capitalizeFirstLetter(option.value) === normalizedInput;
        });
        return !exists && normalizedInput.length > 1;
      }}
    />
  );
}
