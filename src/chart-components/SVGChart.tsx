import React from "react";

import { Line, Circle, Planet, Cusps, SubWheel } from "./SVGComponents.tsx";
import { avoidCollision } from "../utils.ts";
import {
  Fixstars,
  subWheelTypeAtom,
  type Planet as PlanetType,
} from "./Chart.tsx";
import classes from "./SVGChart.module.css";

import { useAtomValue } from "jotai";
const svgWidth = 404;
const radius_out = 49;
const radius_zodiac = 43;

const radius_house = 13;
const radius_inner = 10;
const stroke = [5, 0.5, 0.5, 0.5, 0.5, 0.5]; //stroke of circles from outside to inside
const diff = 9; //avoid planets overlapped in chart

type SVGChartProps = {
  planetState: Record<string, PlanetType> | null;
  cusps: number[] | null;
  planetState2: Record<string, PlanetType> | null;
  cusps2: number[] | null;
  fixstar: Fixstars;
  // children?: ReactNode;
};
export default function SVGChart({
  planetState,
  cusps,
  planetState2,
  cusps2,
  fixstar,
}: // children,
SVGChartProps) {
  const innerPlanetState = planetState ? planetState : planetState2;
  const innerCusps = cusps ? cusps : cusps2;
  const biWheel = planetState !== null && planetState2 !== null;

  const outerPlanetState = biWheel ? planetState2 ?? planetState : null;
  // const outerCusps = cusps && cusps2 ? cusps2 : cusps || cusps2;

  const planetNonCollision = avoidCollision(innerPlanetState!, diff);
  const planetNonCollisionOuter = outerPlanetState
    ? avoidCollision(outerPlanetState, diff * 0.7)
    : null;

  const subWheelType = useAtomValue(subWheelTypeAtom);
  const radius_sub = subWheelType === "0" ? radius_zodiac : 40;
  const radius_planet_out = biWheel //outer radius of inner planets (natal in biwheel usually)
    ? 0.5 * radius_sub + 0.5 * radius_house
    : radius_sub;

  const radius_planet = radius_planet_out * 0.8 + radius_house * 0.2;
  const radius_planet_degree = radius_planet_out * 0.57 + radius_house * 0.43;
  const radius_planet_zodiac = radius_planet_out * 0.36 + radius_house * 0.64;
  const radius_planet_minute = radius_planet_out * 0.2 + radius_house * 0.8;
  const radius_planet_retro = radius_house * 0.6 + radius_planet_minute * 0.4;

  const radius_planet2 = radius_sub * 0.8 + radius_planet_out * 0.2;
  const radius_planet_degree2 = radius_sub * 0.57 + radius_planet_out * 0.43;
  const radius_planet_zodiac2 = radius_sub * 0.36 + radius_planet_out * 0.64;
  const radius_planet_minute2 = radius_sub * 0.2 + radius_planet_out * 0.8;
  const radius_planet_retro2 =
    radius_planet_out * 0.6 + radius_planet_minute2 * 0.4;
  // console.log("SVGPrepare", planetState, planetState2, cusps, cusps2);
  const planetLine = biWheel ? 1 : 2;
  return (
    <>
      {innerPlanetState && (
        <svg
          viewBox={
            -svgWidth / 2 +
            " -" +
            svgWidth / 2 +
            " " +
            svgWidth +
            " " +
            svgWidth
          }
          className={classes.chart}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          style={{ position: "relative" }}
        >
          {[
            radius_out,
            radius_house,
            radius_zodiac,
            radius_sub,
            radius_inner,
            radius_planet_out,
          ].map((r, index) => (
            <Circle key={index} radius={r + "%"} stroke={stroke[index]} />
          ))}
          <Cusps
            cusps={innerCusps!}
            radiusSub={radius_sub}
            radiusInner={radius_inner}
            radiusOut={radius_out}
          />

          <SubWheel
            radius_zodiac={radius_zodiac}
            radius_sub={radius_sub}
            fixstars={fixstar}
            leftDegree={innerCusps![0]}
            type={subWheelType}
          />
          {Object.keys(innerPlanetState!).map((planetIndex) => {
            if (innerPlanetState![planetIndex].shown == false) return;
            return (
              <React.Fragment key={planetIndex}>
                <Planet
                  planet={planetIndex} //1,2,3, etc.
                  lon={innerPlanetState![planetIndex].lon}
                  direction={
                    (innerPlanetState![planetIndex].speed ?? Infinity) < 0
                  }
                  radius_planet={radius_planet}
                  radius_planet_degree={radius_planet_degree}
                  radius_planet_zodiac={radius_planet_zodiac}
                  radius_planet_minute={radius_planet_minute}
                  radius_planet_retro={radius_planet_retro}
                  planetNonCollision={planetNonCollision[planetIndex]}
                  leftDegree={innerCusps![0]}
                  biWheel={biWheel}
                />
                <Line
                  startRadius={radius_planet_out}
                  length={planetLine}
                  theta={innerPlanetState![planetIndex].lon}
                  leftDegree={innerCusps![0]}
                />
              </React.Fragment>
            );
          })}
          {outerPlanetState &&
            Object.keys(outerPlanetState!).map((planetIndex) => {
              if (outerPlanetState![planetIndex].shown == false) return;
              return (
                <React.Fragment key={planetIndex}>
                  <Planet
                    planet={planetIndex} //1,2,3, etc.
                    lon={outerPlanetState![planetIndex].lon}
                    direction={
                      (outerPlanetState![planetIndex].speed ?? Infinity) < 0
                    }
                    radius_planet={radius_planet2}
                    radius_planet_degree={radius_planet_degree2}
                    radius_planet_zodiac={radius_planet_zodiac2}
                    radius_planet_minute={radius_planet_minute2}
                    radius_planet_retro={radius_planet_retro2}
                    planetNonCollision={planetNonCollisionOuter![planetIndex]}
                    leftDegree={innerCusps![0]}
                    biWheel={biWheel}
                  />
                  <Line
                    startRadius={radius_sub}
                    length={planetLine}
                    theta={outerPlanetState![planetIndex].lon}
                    leftDegree={innerCusps![0]}
                  />
                </React.Fragment>
              );
            })}
          {/* {children} */}
        </svg>
      )}
    </>
  );
}
