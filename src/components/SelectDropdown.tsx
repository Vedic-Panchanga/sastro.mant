import { NativeSelect } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
type SelectDropdownProps = {
  option: string;
  options: Record<string, string>;
  setOption: Dispatch<SetStateAction<string>>;
  inputLabel: React.ReactNode;
};
export default function SelectDropdown({
  option,
  options,
  setOption,
  inputLabel,
}: SelectDropdownProps) {
  const data = Object.entries(options).map(([key, value]) => ({
    value: key,
    label: value,
  }));
  return (
    <NativeSelect
      label={inputLabel}
      value={option}
      onChange={(event) => setOption(event.currentTarget.value)}
      data={data}
      // maw={150}
    />
  );
}
