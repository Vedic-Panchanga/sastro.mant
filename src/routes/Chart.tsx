import { useOutletContext } from "react-router-dom";
// import { planetsSymbol } from "../utils.ts";
import { useAtomValue } from "jotai";
// import Accordion from "react-bootstrap/Accordion";
// import { TabChart } from "../components/Chart-related.jsx";

import ChartDrawingWrapper from "../chart-components/ChartDrawingWrapper";
// import ButtonGroupTwoOpt from "../component/ButtonGroupTwoOpt";
import { type Location, type DateTimeT } from "./Root";
import {
  helioAtom,
  houseAtom,
  sidModeAtom,
  siderealOrTropicalAtom,
} from "../settings/chart-settings/General";
import { distance, planetsSymbol, timestamp2jdut } from "../utils";
import astrologer from "../astrologer.ts";
import { useEffect, useState } from "react";
// import { ChartDrawingOptions } from "../chart-components/ChartDrawingOptions";

// 定义 Planet 类型
export type Planet = {
  name: string;
  lon: number;
  lat?: number;
  distance?: number;
  speed?: number;
  speed_lat?: number;
  speed_distance?: number;
  iflagret?: number;
  shown?: boolean;
};

// 定义 Fixstar 类型
type Fixstar = {
  name: string;
  lon: number;
  lat: number;
  mag: number;
  iflagret: number;
};

// 定义 Fixstar 类型
export type Fixstars = {
  [key: number]: Fixstar;
};

// 定义 House 类型
type House = number[];

// 定义 Wasm 类型
export type WasmType = {
  jd_ut: number;
  planets: Record<string, Planet>;
  house: House;
  fixstar: Fixstars;
};
// function MoonRelatedInfo({ wasm, weekday }) {
//   const moonPhase = (wasm.planets[1].lon - wasm.planets[0].lon + 360) % 360;
//   return (
//     <div className="chart-topright">
//       <div>{`moon phase: ${(moonPhase / 3.6).toFixed(2)}%`}</div>
//       <div>{`tithi: ${Math.ceil(moonPhase / 12)} (${(moonPhase / 12).toFixed(
//         2
//       )})`}</div>
//       <div className="astro-font">
//         day lord {planetsSymbol([1, 4, 2, 5, 3, 6, 0][weekday - 1])}
//       </div>
//     </div>
//   );
// }
export default function Chart() {
  const [dateTime, , location]: [DateTimeT, never, Location] =
    useOutletContext();

  //Hooks
  const helio = useAtomValue(helioAtom); //false: geocentric, true: heliocentric
  const siderealOrTropical = useAtomValue(siderealOrTropicalAtom); //false: tropical, true: sidereal
  const sidMode = useAtomValue(sidModeAtom); //swe_set_sid_mode
  const house = useAtomValue(houseAtom); //swe_house_ex
  const [wasm, setWasm] = useState<WasmType | null>(null);

  useEffect(() => {
    astrologer(
      timestamp2jdut(dateTime.toUnixInteger()),
      siderealOrTropical === false ? -1 : Number(sidMode),
      location.longitude,
      location.latitude,
      0,
      house,
      258 | (helio === true ? 8 : 0),
      2 | 1 | 128
    )
      .then((wasm) => {
        setWasm(wasm);
        // console.log(wasm);

        // calculate positions
        const planetState = wasm.planets;
        // eslint-disable-next-line no-inner-declarations
        function planetStateAdd(planetIndex: string, planetLongitude: number) {
          planetState[planetIndex] = {
            name: planetsSymbol(planetIndex, true),
            lon: planetLongitude,
          };
        }
        //add IC, Dsc
        planetStateAdd("-5", (planetState[-4].lon + 180) % 360);
        planetStateAdd("-7", (planetState[-6].lon + 180) % 360);
        if (!helio) {
          //add Fortune and Spirit Parts
          const distanceASCToSun = distance(
            planetState[-4].lon,
            planetState[0].lon
          );
          const dayOrNight = distanceASCToSun >= 0 && distanceASCToSun < 180;
          const distanceMoonToSun = distance(
            planetState[1].lon,
            planetState[0].lon
          );
          // Fortune
          planetStateAdd(
            "-3",
            (planetState[-4].lon +
              (dayOrNight === false ? distanceMoonToSun : -distanceMoonToSun) +
              360) %
              360
          );
          // Spirit
          planetStateAdd(
            "-9",
            (planetState[-4].lon +
              (dayOrNight === false ? -distanceMoonToSun : distanceMoonToSun) +
              360) %
              360
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error
      });
  }, [dateTime, location, helio, house, sidMode, siderealOrTropical]);

  return (
    <div>
      {wasm && (
        <ChartDrawingWrapper wasm={wasm} helio={helio}></ChartDrawingWrapper>
      )}
    </div>
  );
}
