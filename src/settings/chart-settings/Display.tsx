import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Chip } from "@mantine/core";
import { planetsSymbol } from "../../utils";
import classes from "./Display.module.css";
const defaultSettings: Record<string, boolean> = {
  // Sun: true,
  // Moon: true,
  // Mercury: true,
  // Venus: true,
  // Mars: true,
  // Jupiter: true,
  // Saturn: true,
  // Uranus: true,
  // Neptune: true,
  // Pluto: true,
  //Ceres
  "17": false,
  //Pallas
  "18": false,
  //Juno
  "19": false,
  //Vesta
  "20": false,
  //Chiron
  "15": true,
  //Pholus
  "16": false,
  //Node
  "10": true,
  "11": false,
  //Lilith
  "12": true,
  "13": false,
  "21": false,
  "22": false,
  // // Asc
  // "-4": true,
  // // MC
  // "-6": true,
  //Vertex
  "-2": false,
  //"East P."
  "-8": false,
  //"Ft. P."
  "-3": true,
  //"Sp. P."
  "-9": false,
  //Dsc
  "-5": false,
  //ID
  "-7": false,
};

export const displayAtom = atomWithStorage("display", defaultSettings);
/**
 * Which planets to display
 * @returns
 */
export default function ChartDisplaySettings() {
  const [display, setDisplay] = useAtom(displayAtom);
  return (
    <div className={classes.container}>
      {Object.entries(display).map(([key, value]) => (
        <Chip
          key={key}
          checked={value}
          onChange={() => setDisplay((prev) => ({ ...prev, [key]: !value }))}
        >
          {planetsSymbol(key, true)}
        </Chip>
      ))}
    </div>
  );
}
