//calculate and prepare for drawing
import { ReactNode } from "react";
import { type WasmType } from "./Chart";
import classes from "./ChartDrawingWrapper.module.css";

import { useAtomValue } from "jotai";
// import {
//   lilithTypeAtom,
//   nodeTypeAtom,
// } from "../settings/chart-settings/General";
import { displayAtom } from "../settings/chart-settings/Display";
import SVGChart from "./SVGChart";
import ChartTable from "./ChartTable";

type ChartDrawingOptionsProps = {
  wasm: WasmType;
  children?: ReactNode;
};

export default function ChartDrawingWrapper({
  wasm,
  children,
}: ChartDrawingOptionsProps) {
  //Hooks
  // const nodeType = useAtomValue(nodeTypeAtom); //false: "mean", true: "true"
  // const lilithType = useAtomValue(lilithTypeAtom); //0: "mean", 1: "true" 2: intp
  const display = useAtomValue(displayAtom);

  //Calculate the position of planets
  const planetState = JSON.parse(JSON.stringify(wasm.planets));
  // console.log("planetState", planetState);

  // console.log(wasm.reflag);

  Object.keys(planetState).forEach((planetIndex) => {
    planetState[planetIndex].shown = display[planetIndex] ?? true;

    if (wasm.reflag & 8) {
      //heliocentric
      if (
        nodeList.includes(Number(planetIndex)) ||
        lilithList.includes(Number(planetIndex)) ||
        planetIndex === "0" ||
        planetIndex === "1"
      )
        planetState[planetIndex].shown = false;
    } else {
      //geocentric
      if (planetIndex === "14") {
        planetState[planetIndex].shown = false;
      }
    }
  });
  return (
    <div className={classes.container}>
      <SVGChart
        planetState={planetState}
        cusps={wasm.house}
        fixstar={wasm.fixstar}
      />
      {children}
      <ChartTable planetState={planetState} fixstar={wasm.fixstar} />
    </div>
  );
}
const nodeList = [10, 11];
const lilithList = [21, 22, 13, 12];
