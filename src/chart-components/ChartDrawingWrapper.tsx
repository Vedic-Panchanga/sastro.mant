import { ReactNode } from "react";
import { type WasmType } from "../routes/Chart";
import classes from "./ChartDrawingWrapper.module.css";

import { useAtomValue } from "jotai";
import {
  lilithTypeAtom,
  nodeTypeAtom,
} from "../settings/chart-settings/General";
import { displayAtom } from "../settings/chart-settings/Display";
import SVGChart from "./SVGChart";
import ChartTable from "./ChartTable";

type ChartDrawingOptionsProps = {
  wasm: WasmType;
  helio: boolean;
  children?: ReactNode;
};
//calculate and prepare for drawing
export default function ChartDrawingWrapper({
  wasm,
  helio,
  children,
}: ChartDrawingOptionsProps) {
  //Hooks
  const nodeType = useAtomValue(nodeTypeAtom); //false: "mean", true: "true"
  const lilithType = useAtomValue(lilithTypeAtom); //0: "mean", 1: "true" 2: intp
  const display = useAtomValue(displayAtom);

  //Calculate the position of planets
  const planetState = wasm.planets;
  // console.log("planetState", planetState);
  if (!helio && !(wasm.reflag | 8)) {
    //return flag does not have helio bit
    planetState[nodeType ? 10 : 11].shown = false;
    planetState[nodeType ? 11 : 10].shown = display[10];

    planetState[12].shown = false;
    planetState[13].shown = false;
    planetState[21].shown = false;
    planetState[22].shown = false;
    if (lilithType === 2) {
      planetState[21].shown = display[12];
      planetState[22].shown = display[12];
    } else if (lilithType === 1) {
      planetState[13].shown = display[12];
    } else {
      planetState[12].shown = display[12];
    }
  }
  Object.keys(planetState).forEach((planetIndex) => {
    if (
      (Number(planetIndex) >= 10 && Number(planetIndex) <= 13) ||
      Number(planetIndex) >= 21
    )
      return;
    planetState[planetIndex].shown = display[planetIndex] ?? true;
  });
  console.log(planetState);

  return (
    <div className={classes.container}>
      <SVGChart planetState={planetState} cusps={wasm.house} />
      {children}
      <ChartTable planetState={planetState} fixstar={wasm.fixstar} />
    </div>
  );
}
