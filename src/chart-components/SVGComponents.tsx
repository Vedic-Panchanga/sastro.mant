import React from "react";
import {
  middle,
  parseDegree,
  planetsSymbol,
  subWheelNakNameList,
  zodiacSymbol,
} from "../utils.ts";
import { Fixstars } from "./Chart.tsx";
import { useAtomValue } from "jotai";
import { typeZodiacAtom } from "../settings/chart-settings/CustomGraphics.tsx";

// Constants for default values
const DEFAULT_FONT_SIZE = "100%";
const DEFAULT_FONT_WEIGHT = "normal";
const DEFAULT_STROKE_WIDTH = "1px";
const DEG2RAD = Math.PI / 180;
type TextProps = {
  displayText: string;
  distanceFromCenter: number;
  angleInDegrees: number;
  textColor?: number;
  textSize?: string;
  angleOffset?: number;
  textWeight?: string;
};
export function Text({
  displayText,
  distanceFromCenter,
  angleInDegrees,
  textColor,
  textSize = DEFAULT_FONT_SIZE,
  //   fontWeight,
  //   isPlanet,
  angleOffset = 0,
  textWeight = DEFAULT_FONT_WEIGHT,
}: TextProps) {
  const cos_value = Math.cos(DEG2RAD * (angleInDegrees - angleOffset));
  const sin_value = Math.sin(DEG2RAD * (angleInDegrees - angleOffset));
  return (
    <text
      x={-distanceFromCenter * cos_value + "%"}
      y={+distanceFromCenter * sin_value + "%"}
      // fontFamily="Arial"
      fontSize={textSize}
      // fill={textColor}
      textAnchor="middle"
      alignmentBaseline="middle"
      fontWeight={textWeight}
      stroke="white"
      paintOrder="stroke"
      strokeWidth="2"
      className={`color-${textColor}`}
    >
      {displayText}
    </text>
  );
}
type LineProps = {
  startRadius: number;
  length: number;
  theta: number;
  leftDegree?: number;
  color?: string;
  strokeWidth?: string;
};
export function Line({
  startRadius,
  length, // in %
  theta,
  leftDegree = 0,
  color = "black",
  strokeWidth = DEFAULT_STROKE_WIDTH,
}: LineProps) {
  const cos_value = Math.cos(DEG2RAD * (theta - leftDegree));
  const sin_value = Math.sin(DEG2RAD * (theta - leftDegree));
  const endRadius = startRadius - length;
  return (
    <line
      x1={-startRadius * cos_value + "%"}
      y1={+startRadius * sin_value + "%"}
      x2={-endRadius * cos_value + "%"}
      y2={+endRadius * sin_value + "%"}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  );
}

type CircleProps = { radius: number | string; stroke: number };
export function Circle({ radius, stroke }: CircleProps) {
  return (
    <>
      <circle
        cx="0"
        cy="0"
        r={radius}
        stroke="black"
        fill="none"
        strokeWidth={stroke}
      ></circle>
    </>
  );
}

type CuspsProps = {
  cusps: number[];
  radiusOut: number;
  radiusInner: number;
  radiusZodiac: number;
};
export function Cusps({
  cusps,
  radiusZodiac,
  radiusInner,
  radiusOut,
}: CuspsProps) {
  const strokeWidth_ASCMC = "4px";
  const strokeWidth_notASCMC = DEFAULT_STROKE_WIDTH;
  const radiusCuspsDegree = 0.5 * radiusOut + 0.5 * radiusZodiac;
  const houseRadius = radiusInner * 1.15;
  const lengthCusps = radiusZodiac - radiusInner;
  const typeZodiac = useAtomValue(typeZodiacAtom);
  const cuspsWhole =
    (cusps[0] + 30 === cusps[1] || cusps[0] + 330 === cusps[1]) &&
    cusps[0] === Math.floor(cusps[0]);
  return (
    <>
      {cusps.map((cusp, i) => (
        <React.Fragment key={`cusp_${i}`}>
          <Line
            startRadius={radiusZodiac}
            length={lengthCusps}
            theta={cusps[i]}
            leftDegree={cusps[0]}
            strokeWidth={i % 3 === 0 ? strokeWidth_ASCMC : strokeWidth_notASCMC}
          />
          <Text
            displayText={(i + 1).toString()}
            distanceFromCenter={houseRadius}
            angleInDegrees={middle(cusps[i], cusps[(i + 1) % 12])}
            angleOffset={cusps[0]}
            textSize="50%"
            textWeight="normal"
          />
          {typeZodiac && !cuspsWhole && (
            <>
              <Text
                displayText={parseDegree(cusp).degree.toString()}
                distanceFromCenter={radiusCuspsDegree}
                angleInDegrees={cusps[i] + 5}
                angleOffset={cusps[0]}
                textSize="75%"
                textWeight="bold"
              />
              <Text
                displayText={zodiacSymbol(parseDegree(cusp).zodiac)}
                distanceFromCenter={radiusCuspsDegree}
                angleInDegrees={cusps[i]}
                angleOffset={cusps[0]}
                textSize="90%"
                textColor={parseDegree(cusp).zodiac % 4}
              />
              <Text
                displayText={parseDegree(cusp).minute.toString()}
                distanceFromCenter={radiusCuspsDegree}
                angleInDegrees={cusps[i] - 5}
                angleOffset={cusps[0]}
                textSize="50%"
              />
            </>
          )}
        </React.Fragment>
      ))}
      {(!typeZodiac || cuspsWhole) &&
        [...Array(12).keys()].map((index) => (
          <>
            <Text
              displayText={zodiacSymbol(index)}
              distanceFromCenter={radiusCuspsDegree}
              angleInDegrees={(index * 30 + 15) % 360}
              angleOffset={cusps[0]}
              textSize="90%"
              textColor={index % 4}
            />
            <Line
              startRadius={radiusOut}
              length={radiusOut - radiusZodiac}
              theta={index * 30}
              leftDegree={cusps[0]}
            />
          </>
        ))}
    </>
  );
}
type SubWheelProps = {
  radius_zodiac: number;
  radius_sub: number;
  fixstars: Fixstars;
  leftDegree: number;
  type: string;
};
export function SubWheel({
  radius_zodiac,
  radius_sub,
  fixstars,
  leftDegree,
  type,
}: SubWheelProps) {
  if (type === "0") return null;
  const distanceFromCenter = (radius_zodiac + radius_sub) / 2;
  return subWheelNakNameList.map((nakNameListSlice, index) => {
    if (type == "27" && index == 27) return null;
    let cuspStart: number = 0;
    let cuspEnd: number = 0;
    if (type == "27") {
      cuspStart = (13.33333333333333 * index + 280) % 360;
      cuspEnd = (13.33333333333333 * index + 320) % 360;
    } else if (type == "28") {
      cuspStart = fixstars[nakNameListSlice[2]].lon;
      cuspEnd = fixstars[subWheelNakNameList[(index + 1) % 28][2]].lon;
    }
    const cuspName = nakNameListSlice[1];
    const cuspNamePosition =
      Math.abs(cuspEnd - cuspStart) < 90
        ? (cuspEnd + cuspStart) / 2
        : middle(cuspStart, cuspEnd);
    // console.log(nakNameListSlice[2], fixstars[nakNameListSlice[2]]);

    return (
      <React.Fragment key={index}>
        <Line
          startRadius={radius_zodiac}
          length={radius_zodiac - radius_sub}
          theta={cuspStart}
          leftDegree={leftDegree}
          strokeWidth="0.5px"
        />
        <Text
          displayText={cuspName}
          distanceFromCenter={distanceFromCenter}
          angleInDegrees={cuspNamePosition}
          textSize="48%"
          angleOffset={leftDegree}
        />
      </React.Fragment>
    );
  });
}
type PlanetProps = {
  planet: string;
  lon: number;
  direction: boolean;
  radius_planet: number;
  radius_planet_degree: number;
  radius_planet_zodiac: number;
  radius_planet_minute: number;
  radius_planet_retro: number;
  planetNonCollision: number;
  leftDegree: number;
  biWheel?: boolean;
};
export function Planet({
  planet, //"1", "2", etc
  lon,
  direction,
  radius_planet,
  radius_planet_degree,
  radius_planet_zodiac,
  radius_planet_minute,
  radius_planet_retro,
  planetNonCollision,
  leftDegree,
  biWheel,
}: PlanetProps) {
  const resPosition = parseDegree(lon);
  const fontsize_degree = biWheel ? "50%" : "75%";
  const fontsize_planets = biWheel ? "75%" : "100%";
  const fontsize_planets_text = biWheel ? "50%" : "60%";
  const fontsize_zodiac = biWheel ? "50%" : "78%";
  const fontsize_minute = biWheel ? "40%" : "50%";
  const fontsize_retro = biWheel ? "35%" : "40%";
  const element = Math.floor(resPosition.zodiac % 4);
  // const textPlanet = ["Asc", "Vtx", "MC", "EP", "Sp. P."];
  return (
    <>
      <Text
        displayText={planetsSymbol(planet).toString()}
        distanceFromCenter={radius_planet}
        angleInDegrees={planetNonCollision}
        textColor={element}
        textSize={
          Number(planet) < -3 ? fontsize_planets_text : fontsize_planets
        }
        angleOffset={leftDegree}
        textWeight="bold"
      />
      <Text
        displayText={resPosition.degree.toString()}
        distanceFromCenter={radius_planet_degree}
        angleInDegrees={planetNonCollision}
        // color="black"
        textSize={fontsize_degree}
        angleOffset={leftDegree}
        textWeight="bold"
      />
      <Text
        displayText={zodiacSymbol(resPosition.zodiac)}
        distanceFromCenter={radius_planet_zodiac}
        angleInDegrees={planetNonCollision}
        textColor={element}
        textSize={fontsize_zodiac}
        angleOffset={leftDegree}
      />
      {direction && (
        <Text
          displayText={"℞"}
          distanceFromCenter={radius_planet_retro}
          angleInDegrees={planetNonCollision}
          textColor={0}
          textSize={fontsize_retro}
          angleOffset={leftDegree}
        />
      )}
      <Text
        displayText={resPosition.minute.toString()}
        distanceFromCenter={radius_planet_minute}
        angleInDegrees={planetNonCollision}
        textSize={fontsize_minute}
        angleOffset={leftDegree}
      />
    </>
  );
}
