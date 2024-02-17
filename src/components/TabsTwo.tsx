import { SegmentedControl } from "@mantine/core";
import classes from "./TabsTwo.module.css";
type TabsTwoProps = {
  option: boolean;
  setOption: React.Dispatch<React.SetStateAction<boolean>>;
  optionLabel: [string, string];
};
export default function TabsTwo({
  option,
  setOption,
  optionLabel,
}: TabsTwoProps) {
  return (
    <SegmentedControl
      value={optionLabel[+option]}
      onChange={(newValue) => setOption(newValue === optionLabel[1])}
      data={optionLabel}
      size="xs"
      className={classes.tabs}
    />
  );
}
