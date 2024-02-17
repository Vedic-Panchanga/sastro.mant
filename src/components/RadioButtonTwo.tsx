// //true or mean
// import { Group, Radio } from "@mantine/core";
// import { Dispatch, SetStateAction } from "react";
// import classes from "./RadioButtonTwo.module.css";
// type RadioButtonsGroupTwoType = {
//   option: boolean;
//   setOption: Dispatch<SetStateAction<boolean>>;
//   optionLabel: string;
// };
// export default function RadioButtonsTwo({
//   option,
//   setOption,
//   optionLabel,
// }: RadioButtonsGroupTwoType) {
//   return (
//     <Radio.Group
//       value={(+option).toString()}
//       onChange={(e) => setOption(e === "1")}
//       label={optionLabel}
//     >
//       <Group mt="xs">
//         <Radio
//           value="0"
//           label="mean"
//           labelPosition="left"
//           classNames={{ labelWrapper: classes.labelWrapper }}
//         />
//         <Radio
//           value="1"
//           label="true"
//           labelPosition="right"
//           classNames={{ labelWrapper: classes.labelWrapper }}
//         />
//       </Group>
//     </Radio.Group>
//   );
// }
