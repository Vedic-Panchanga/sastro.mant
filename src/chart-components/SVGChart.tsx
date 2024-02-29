import React from "react";

import { Line, Circle, Planet, Cusps, SubWheel } from "./SVGComponents.tsx";
import { avoidCollision } from "../utils.ts";
import { Fixstars, type Planet as PlanetType } from "./Chart.tsx";
import classes from "./SVGChart.module.css";
import { subWheelTypeAtom } from "../settings/chart-settings/General.tsx";
import { useAtomValue } from "jotai";
const svgWidth = 404;
const radius_out = 49;
const radius_zodiac = 42;

const radius_house = 13;
const radius_inner = 10;
const stroke = [5, 1, 1, 1, 1]; //stroke of circles from outside to inside
const diff = 9; //avoid planets overlapped in chart

type SVGChartProps = {
  planetState: Record<string, PlanetType>;
  cusps: number[];
  fixstar: Fixstars;
};
export default function SVGChart({
  planetState,
  cusps,
  fixstar,
}: SVGChartProps) {
  // const short_length_pl = 0.1;
  // const short_length_xtick_minor = 0.15;
  // const short_length_xtick_major = 0.3;
  // const linewidth_wide = 2;
  // const linewidth_middle = 1;
  // const linewidth_thin = 1;
  // const linewidth_light = 0.3;

  const planetNonCollision = avoidCollision(planetState, diff);
  const subWheelType = useAtomValue(subWheelTypeAtom);
  const radius_sub = subWheelType === "0" ? radius_zodiac : 39;
  const radius_planet = radius_sub * 0.8 + radius_house * 0.2;
  const radius_planet_degree = radius_sub * 0.57 + radius_house * 0.43;
  const radius_planet_zodiac = radius_sub * 0.36 + radius_house * 0.64;
  const radius_planet_minute = radius_sub * 0.2 + radius_house * 0.8;
  const radius_planet_retro = radius_house * 0.8 + radius_planet_minute * 0.2;
  return (
    <svg
      viewBox={
        -svgWidth / 2 + " -" + svgWidth / 2 + " " + svgWidth + " " + svgWidth
      }
      className={classes.chart}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      {[radius_out, radius_house, radius_zodiac, radius_sub, radius_inner].map(
        (r, index) => (
          <Circle key={r} radius={r + "%"} stroke={stroke[index]} />
        )
      )}
      <Cusps
        cusps={cusps}
        radiusSub={radius_sub}
        radiusInner={radius_inner}
        radiusCuspsDegree={radius_zodiac * 0.5 + radius_out * 0.5}
        // fixstar={fixstar}
      />
      <SubWheel
        radius_zodiac={radius_zodiac}
        radius_sub={radius_sub}
        fixstars={fixstar}
        leftDegree={cusps[0]}
        type={subWheelType}
      />
      {Object.keys(planetState).map((planetIndex) => {
        if (planetState[planetIndex].shown == false) return;
        return (
          <React.Fragment key={planetIndex}>
            <Planet
              planet={planetIndex} //1,2,3, etc.
              lon={planetState[planetIndex].lon}
              direction={(planetState[planetIndex].speed ?? Infinity) < 0}
              radius_planet={radius_planet}
              radius_planet_degree={radius_planet_degree}
              radius_planet_zodiac={radius_planet_zodiac}
              radius_planet_minute={radius_planet_minute}
              radius_planet_retro={radius_planet_retro}
              planetNonCollision={planetNonCollision[planetIndex]}
              leftDegree={cusps[0]}
            />
            <Line
              startRadius={radius_sub}
              length={2}
              theta={planetState[planetIndex].lon}
              leftDegree={cusps[0]}
            />
          </React.Fragment>
        );
      })}
    </svg>
  );
}
