import { Radio } from "@mantine/core";
import { Dispatch, ReactNode, SetStateAction } from "react";
import classes from "./RadioGroup.module.css";
type RadioGroupProps = {
  option: string;
  options: Record<string, ReactNode>;
  setOption: Dispatch<SetStateAction<string>>;
  inputLabel: React.ReactNode;
  direction?: "horizontal" | "vertical";
};
export default function RadioGroup({
  option,
  options,
  setOption,
  inputLabel,
  direction = "horizontal",
}: RadioGroupProps) {
  // console.log(option, options);

  const data = Object.entries(options).map(([key, reactNode], index) => (
    <Radio
      key={index}
      value={key}
      label={reactNode}
      checked={option == key.toString()}
      onChange={(event) => setOption(event.currentTarget.value)}
    />
  ));
  return (
    <>
      <div>
        <strong>{inputLabel}</strong>
      </div>
      <div
        className={
          direction === "horizontal"
            ? classes.optionGroup
            : classes.optionGroupVertical
        }
      >
        {data}
      </div>
    </>
  );
}
