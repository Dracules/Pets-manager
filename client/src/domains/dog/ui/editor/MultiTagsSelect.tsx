import CreatableSelect from 'react-select/creatable';

type Option = {
  readonly value: string;
  readonly label: string;
};

interface MultiTagsSelectProps {
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
}

export function MultiTagsSelect({
  value = [],
  onChange,
}: MultiTagsSelectProps) {
  const selectValue: readonly Option[] = value.map((element) => ({
    value: element,
    label: element,
  }));

  return (
    <CreatableSelect<Option, true>
      value={selectValue}
      onChange={(newValue) => {
        const stringValues = newValue?.length
          ? newValue.map((element) => element.value)
          : undefined;
        onChange(stringValues);
      }}
      isMulti
      isClearable
    />
  );
}
