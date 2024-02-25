import { SegmentedControl } from "@mantine/core";
import classes from "./TabsTwo.module.css";
type TabsThreeProps = {
  option: number;
  setOption: React.Dispatch<React.SetStateAction<number>>;
  optionLabel: {
    value: string;
    label: string;
  }[];
};
export default function TabsThree({
  option,
  setOption,
  optionLabel,
}: TabsThreeProps) {
  console.log("option", option);

  return (
    <SegmentedControl
      value={option.toString()}
      onChange={(newValue) => setOption(Number(newValue))}
      data={optionLabel}
      size="xs"
      className={classes.tabs}
    />
  );
}
