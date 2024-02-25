import React from "react";
import {
  colorTheme,
  middle,
  parseDegree,
  planetsSymbol,
  zodiacSymbol,
} from "../utils.ts";
// Constants for default values
const DEFAULT_COLOR = "black";
const DEFAULT_FONT_SIZE = "100%";
const DEFAULT_FONT_WEIGHT = "normal";
const DEFAULT_STROKE_WIDTH = "1px";
const DEG2RAD = Math.PI / 180;
type TextProps = {
  displayText: string;
  distanceFromCenter: number;
  angleInDegrees: number;
  textColor?: string;
  textSize?: string;
  angleOffset?: number;
  textWeight?: string;
};
export function Text({
  displayText,
  distanceFromCenter,
  angleInDegrees,
  textColor = DEFAULT_COLOR,
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
      fill={textColor}
      textAnchor="middle"
      alignmentBaseline="middle"
      fontWeight={textWeight}
      stroke="white"
      paintOrder="stroke"
      strokeWidth="2"
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
  radiusZodiac: number;
  radiusInner: number;
  radiusCuspsDegree: number;
};
export function Cusps({
  cusps,
  radiusZodiac,
  radiusInner,
  radiusCuspsDegree,
}: CuspsProps) {
  const strokeWidth_ASCMC = "4px";
  const strokeWidth_notASCMC = DEFAULT_STROKE_WIDTH;
  const houseRadius = radiusInner * 1.15;
  const lengthCusps = radiusZodiac - radiusInner;
  return cusps.map((cusp, i) => (
    <React.Fragment key={`c usp_${i}`}>
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
        angleInDegrees={middle(cusps[(i + 1) % 12], cusps[i])}
        angleOffset={cusps[0]}
        textSize="50%"
        textWeight="normal"
      />
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
        textColor={colorTheme(parseDegree(cusp).zodiac % 4)}
      />
      <Text
        displayText={parseDegree(cusp).minute.toString()}
        distanceFromCenter={radiusCuspsDegree}
        angleInDegrees={cusps[i] - 5}
        angleOffset={cusps[0]}
        textSize="50%"
      />
    </React.Fragment>
  ));
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
}: PlanetProps) {
  const resPosition = parseDegree(lon);
  const fontsize_degree = "75%";
  const fontsize_planets = "100%";
  const fontsize_planets_text = "60%";
  const fontsize_zodiac = "78%";
  const fontsize_minute = "50%";
  const fontsize_retro = "40%";
  const element = Math.floor(resPosition.zodiac % 4);
  const color = colorTheme(element);
  // const textPlanet = ["Asc", "Vtx", "MC", "EP", "Sp. P."];
  return (
    <>
      <Text
        displayText={planetsSymbol(planet).toString()}
        distanceFromCenter={radius_planet}
        angleInDegrees={planetNonCollision}
        textColor={color}
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
        textColor={color}
        textSize={fontsize_zodiac}
        angleOffset={leftDegree}
      />
      <Text
        displayText={resPosition.minute.toString()}
        distanceFromCenter={radius_planet_minute}
        angleInDegrees={planetNonCollision}
        textSize={fontsize_minute}
        angleOffset={leftDegree}
      />
      {direction && (
        <Text
          displayText={"℞"}
          distanceFromCenter={radius_planet_retro}
          angleInDegrees={planetNonCollision}
          textColor="red"
          textSize={fontsize_retro}
          angleOffset={leftDegree}
        />
      )}
    </>
  );
}
