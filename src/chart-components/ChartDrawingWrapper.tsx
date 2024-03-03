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
import { deepCopy } from "../utils";

type ChartDrawingOptionsProps = {
  wasm: WasmType;
  wasm2: WasmType | null;
  children?: ReactNode;
};

export default function ChartDrawingWrapper({
  wasm,
  wasm2,
  children,
}: ChartDrawingOptionsProps) {
  //Hooks
  // const nodeType = useAtomValue(nodeTypeAtom); //false: "mean", true: "true"
  // const lilithType = useAtomValue(lilithTypeAtom); //0: "mean", 1: "true" 2: intp
  const display = useAtomValue(displayAtom);

  //Calculate the position of planets
  const planetState = deepCopy(wasm.planets);

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
  const planetState2 = wasm2 ? deepCopy(wasm2.planets) : null;
  if (planetState2) {
    // const planetState2 = deepCopy(wasm2.planets);
    Object.keys(planetState2).forEach((planetIndex) => {
      planetState2[planetIndex].shown = display[planetIndex] ?? true;

      if (wasm.reflag & 8) {
        //heliocentric
        if (
          nodeList.includes(Number(planetIndex)) ||
          lilithList.includes(Number(planetIndex)) ||
          planetIndex === "0" ||
          planetIndex === "1"
        )
          planetState2[planetIndex].shown = false;
      } else {
        //geocentric
        if (planetIndex === "14") {
          planetState2[planetIndex].shown = false;
        }
      }
    });
  }

  return (
    <div className={classes.container}>
      <div className={classes.svgWrapper}>
        <SVGChart
          planetState={wasm.retype & 1 ? planetState : null}
          cusps={wasm.retype & 1 ? wasm.house : null}
          planetState2={planetState2}
          cusps2={wasm2 ? wasm2.house : null}
          fixstar={wasm.fixstar}
        />
        {children}
      </div>

      <ChartTable planetState={planetState} fixstar={wasm.fixstar} />
    </div>
  );
}
const nodeList = [10, 11];
const lilithList = [21, 22, 13, 12];
