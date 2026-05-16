import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface MonthYearPickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}

export const MonthYearPicker = ({
  selected,
  onChange,
}: MonthYearPickerProps) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showMonthYearPicker
      dateFormat="MM/yyyy"
      maxDate={new Date()}
      placeholderText="Aproximate birth month"
    />
  );
};
