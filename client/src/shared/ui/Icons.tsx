import { GiParrotHead } from 'react-icons/gi';
import { PiCat, PiDog, PiPawPrint } from 'react-icons/pi';

interface IconProps {
  className?: string | undefined;
}

export const AnimalIcon = (props: IconProps) => {
  return <PiPawPrint className={props.className} />;
};

export const CatIcon = (props: IconProps) => {
  return <PiCat className={props.className} />;
};

export const DogIcon = (props: IconProps) => {
  return <PiDog className={props.className} />;
};

export const ParrotIcon = (props: IconProps) => {
  return <GiParrotHead className={props.className} />;
};
