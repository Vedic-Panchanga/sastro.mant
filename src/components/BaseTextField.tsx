import { TextInput } from "@mantine/core";
type InputValuesKey =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "timeZone"
  | "lonDeg"
  | "latDeg"
  | "lonMin"
  | "lonSec"
  | "latMin"
  | "latSec";

type InputValues = {
  [key in InputValuesKey]: string;
};
type HandleInputChange = (identifier: keyof InputValues, value: string) => void;
type BaseTextFieldProps = {
  identifier: InputValuesKey;
  maxWidth?: string;
  placeHolder: string;
  rightSection?: string;
  handleInputChange: HandleInputChange;
  value: string;
  lableShown?: boolean;
};

export default function BaseTextField({
  identifier,
  maxWidth = "10ch",
  placeHolder,
  rightSection,
  value,
  handleInputChange,
  lableShown = true,
}: BaseTextFieldProps) {
  return (
    <TextInput
      label={lableShown ? identifier : undefined}
      style={{ maxWidth: maxWidth }}
      inputMode="numeric"
      value={value}
      onChange={(event) => handleInputChange(identifier, event.target.value)}
      placeholder={placeHolder}
      size="sm"
      rightSection={rightSection}
    />
  );
}
