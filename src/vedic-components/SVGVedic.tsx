import {
  SignText,
  PlanetKendraHouse,
  PlanetTopBottomHouse,
  PlanetSideHouse,
} from "./VedicRelated";
import { groupPlanetsByWholeHouse } from "../utils";
// import { Planet } from "../routes/Chart";
import { type Planet } from "../routes/Vedic";
import classes from "../chart-components/SVGChart.module.css";
export default function SVGVedic({
  planetState,
}: {
  planetState: Record<string, Planet>;
}) {
  const svgWidth = 404;
  const firstHouseSign = Math.floor(planetState[-4].lon / 30);
  const groupPlanets = groupPlanetsByWholeHouse(planetState);
  const size = 95; //percentage chart
  const fontSizePlanet = "130%";
  return (
    <svg
      viewBox={
        -svgWidth / 2 + " -" + svgWidth / 2 + " " + svgWidth + " " + svgWidth
      }
      className={classes.chart}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <g stroke="black">
        {/* outer rect */}
        <rect
          width={size + "%"}
          height={size + "%"}
          x={"-" + size / 2 + "%"}
          y={"-" + size / 2 + "%"}
          fill="none"
          strokeWidth="2"
        />
        {/* inner rect */}
        <line x1={0} y1={"-" + size / 2 + "%"} x2={size / 2 + "%"} y2={0} />
        <line x1={"-" + size / 2 + "%"} y1={0} x2={0} y2={size / 2 + "%"} />
        <line x1={size / 2 + "%"} y1={0} x2={0} y2={size / 2 + "%"} />
        <line
          x1={0}
          y1={"-" + size / 2 + "%"}
          x2={"-" + size / 2 + "%"}
          y2={0}
        />
        {/* diagnol */}
        <line
          x1={"-" + size / 2 + "%"}
          y1={"-" + size / 2 + "%"}
          x2={size / 2 + "%"}
          y2={size / 2 + "%"}
        />
        <line
          x1={"-" + size / 2 + "%"}
          y1={size / 2 + "%"}
          x2={size / 2 + "%"}
          y2={"-" + size / 2 + "%"}
        />
      </g>
      <SignText firstHouseSign={firstHouseSign} size={size} />
      <g
        textAnchor="middle"
        fill="red"
        fontSize={fontSizePlanet}
        dominantBaseline="middle"
      >
        <PlanetKendraHouse
          groupPlanets={groupPlanets[firstHouseSign]}
          size={size}
          house={0}
        />
        <PlanetKendraHouse
          groupPlanets={groupPlanets[(firstHouseSign + 3) % 12]}
          size={size}
          house={3}
        />
        <PlanetKendraHouse
          groupPlanets={groupPlanets[(firstHouseSign + 6) % 12]}
          size={size}
          house={6}
        />
        <PlanetKendraHouse
          groupPlanets={groupPlanets[(firstHouseSign + 9) % 12]}
          size={size}
          house={9}
        />
        <PlanetTopBottomHouse
          groupPlanets={groupPlanets[(firstHouseSign + 1) % 12]}
          size={size}
          house={1}
        />
        <PlanetTopBottomHouse
          groupPlanets={groupPlanets[(firstHouseSign + 5) % 12]}
          size={size}
          house={5}
        />
        <PlanetTopBottomHouse
          groupPlanets={groupPlanets[(firstHouseSign + 7) % 12]}
          size={size}
          house={7}
        />
        <PlanetTopBottomHouse
          groupPlanets={groupPlanets[(firstHouseSign + 11) % 12]}
          size={size}
          house={11}
        />
        <PlanetSideHouse
          groupPlanets={groupPlanets[(firstHouseSign + 2) % 12]}
          size={size}
          house={2}
        />
        <PlanetSideHouse
          groupPlanets={groupPlanets[(firstHouseSign + 4) % 12]}
          size={size}
          house={4}
        />
        <PlanetSideHouse
          groupPlanets={groupPlanets[(firstHouseSign + 8) % 12]}
          size={size}
          house={8}
        />
        <PlanetSideHouse
          groupPlanets={groupPlanets[(firstHouseSign + 10) % 12]}
          size={size}
          house={10}
        />
      </g>
    </svg>
  );
}
