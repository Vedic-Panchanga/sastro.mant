import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { zodiacSymbol } from "../../utils";
import RadioGroup from "../../components/RadioGroup";
import classes from "./CustomGraphics.module.css";
import { ReactNode } from "react";
import TabsTwo from "../../components/TabsTwo";

const defaultSettings = {
  colorMode: "1",
  typeZodiac: true,
};

const createAtom = <T extends keyof typeof defaultSettings>(key: T) =>
  atomWithStorage(key, defaultSettings[key]);

export const colorModeAtom = createAtom("colorMode");
export const typeZodiacAtom = createAtom("typeZodiac");

const colorType = ["colorFire", "colorEarth", "colorAir", "colorWater"];
export const colorSettingOptions: Record<
  string,
  Record<(typeof colorType)[number], string>
> = {
  "0": {
    colorFire: " #cc0000", //red
    colorEarth: "#f1c232", // yellow
    colorAir: "#3d85c6", // blue
    colorWater: "#6aa84f", //green
  },
  // Astro.com color: water is blue
  // air is yellow, earth is green,
  "1": {
    colorFire: " #cc0000", //red
    colorEarth: "#6aa84f", //green
    colorAir: "#f1c232", //yellow
    colorWater: "#3d85c6", //blue
  },
  // 测测 and Aizhanxing color: water is blue
  // air is green, earth is yellow
  "2": {
    colorFire: " #cc0000", //red
    colorEarth: "#f1c232",
    colorAir: "#6aa84f",
    colorWater: "#3d85c6",
  },
};
export default function CustomGraphicsSettings() {
  const [colorMode, setColorMode] = useAtom(colorModeAtom);
  const [typeZodiac, setTypeZodiac] = useAtom(typeZodiacAtom);

  const colorModeOptions: Record<string, ReactNode> = {};
  Object.entries(colorSettingOptions).forEach(
    ([mode, colors]) =>
      (colorModeOptions[mode] = (
        <div className={classes.colorSelectionGroup} key={mode}>
          {colorType.map((color, index) => (
            <div
              className={classes.colorElement}
              style={{ color: colors[color] }}
              key={index}
            >
              {zodiacSymbol(index)}
            </div>
          ))}
        </div>
      ))
  );
  // console.log(colorModeOptions);

  return (
    <>
      <div className={classes.colorRadioGroupWrapper}>
        <RadioGroup
          option={colorMode}
          inputLabel="Color"
          setOption={setColorMode}
          options={colorModeOptions}
        />{" "}
      </div>
      <TabsTwo
        option={typeZodiac}
        setOption={setTypeZodiac}
        optionLabel={["Zodiac", "House"]}
      />
    </>
  );
}
