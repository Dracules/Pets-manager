type Option = {
  readonly value: string;
  readonly label: string;
};

interface MultiTagsSelectProps {
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
}
