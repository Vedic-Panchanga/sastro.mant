import { useOutletContext } from "react-router-dom";
// import { planetsSymbol } from "../utils.ts";
import { atom, useAtomValue } from "jotai";
// import Accordion from "react-bootstrap/Accordion";
// import { TabChart } from "../components/Chart-related.jsx";

import ChartDrawingWrapper from "./ChartDrawingWrapper.tsx";
// import ButtonGroupTwoOpt from "../component/ButtonGroupTwoOpt";
import { type Location, type DateTimeT } from "../routes/Root.tsx";

import { deepCopy, distance, planetsSymbol, timestamp2jdut } from "../utils.ts";
import astrologer from "../astrologer.ts";
import { useEffect, useState } from "react";
import classes from "./Chart.module.css";
import ModalButton from "../components/ModalButton.tsx";
import RadioGroup from "../components/RadioGroup.tsx";
import { Checkbox } from "@mantine/core";
import TimeLocationDisplay from "../components/TimeLocationDisplay.tsx";

const defaultSettings = {
  // nodeType: false,
  // lilithType: 0,
  helio: false,
  siderealOrTropical: false,
  sidMode: "0",
  house: "K",
  subWheelType: "0", //0 none, 1 28, 2 27
};

const createAtom = <T extends keyof typeof defaultSettings>(key: T) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return defaultSettings[key];
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};

// export const nodeTypeAtom = createAtom("nodeType");
// export const lilithTypeAtom = createAtom("lilithType");
export const helioAtom = createAtom("helio");
export const siderealOrTropicalAtom = createAtom("siderealOrTropical");
export const sidModeAtom = createAtom("sidMode");
export const houseAtom = createAtom("house");
export const subWheelTypeAtom = createAtom("subWheelType");

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
  [key: string]: Fixstar;
};

// 定义 House 类型
type House = number[];

// 定义 Wasm 类型
export type WasmType = {
  jd_ut: number;
  planets: Record<string, Planet>;
  house: House;
  fixstar: Fixstars;
  reflag: number;
  retype: number;
};
function MoonRelatedInfo({
  wasm,
  weekday,
}: {
  wasm: WasmType;
  weekday: number;
}) {
  const moonPhase = (wasm.planets[1].lon - wasm.planets[0].lon + 360) % 360;
  return (
    <div className={classes.chartTopright}>
      <div>{`moon phase: ${(moonPhase / 3.6).toFixed(2)}%`}</div>
      <div>{`tithi: ${Math.ceil(moonPhase / 12)} (${(moonPhase / 12).toFixed(
        2
      )})`}</div>
      day lord {planetsSymbol([1, 4, 2, 5, 3, 6, 0][weekday - 1])}
    </div>
  );
}
export default function Chart() {
  const [dateTime, , location]: [DateTimeT, never, Location] =
    useOutletContext();

  //Hooks
  const helio = useAtomValue(helioAtom); //false: geocentric, true: heliocentric
  const siderealOrTropical = useAtomValue(siderealOrTropicalAtom); //false: tropical, true: sidereal
  const sidMode = useAtomValue(sidModeAtom); //swe_set_sid_mode
  const house = useAtomValue(houseAtom); //swe_house_ex
  const [wasm, setWasm] = useState<WasmType | null>(null);
  const [wasm2, setWasm2] = useState<WasmType | null>(null);

  //natal or not
  const [dateTimeTransit, setDateTimeTransit] = useState(dateTime);
  const [locationTransit, setLocationTransit] = useState(location);

  const [chartType, setChartType] = useState("Natal");
  const [outerChartOnly, setOuterChartOnly] = useState<"" | " only">("");
  const [locationSame, setLocationSame] = useState("same");

  function calculatePlanetState(wasm: WasmType) {
    // 计算行星位置
    const planetState = wasm.planets;
    function planetStateAdd(planetIndex: string, planetLongitude: number) {
      planetState[planetIndex] = {
        name: planetsSymbol(planetIndex, true),
        lon: planetLongitude,
      };
    }
    // 添加 IC 和 Dsc
    planetStateAdd("-5", (planetState[-4].lon + 180) % 360);
    planetStateAdd("-7", (planetState[-6].lon + 180) % 360);
    if (!helio) {
      // 添加 Fortune 和 Spirit Parts
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
  }

  useEffect(() => {
    //natal
    astrologer(
      timestamp2jdut(dateTime.toMillis()),
      siderealOrTropical === false ? -1 : Number(sidMode),
      location.longitude,
      location.latitude,
      0,
      house,
      258 | (helio === true ? 8 : 0),
      2 | 1 | 128
    )
      .then((wasmRe: WasmType) => {
        calculatePlanetState(wasmRe);
        setWasm(wasmRe);
        // if (chartType === "Natal" || outerChartOnly !== " only") {
        //   wasm.retype = 1; //display
        // } else {
        //   wasm.retype = -1; //do not display
        // }
        //second chart
        if (chartType !== "Natal") {
          const secondDateTime =
            chartType === "Transit"
              ? dateTimeTransit
              : dateTime.plus({
                  millisecond:
                    dateTimeTransit.diff(dateTime).milliseconds / 365.24217,
                });
          astrologer(
            timestamp2jdut(secondDateTime.toMillis()),
            siderealOrTropical === false ? -1 : Number(sidMode),
            locationSame === "same"
              ? location.longitude
              : locationTransit.longitude,
            locationSame === "same"
              ? location.latitude
              : locationTransit.latitude,
            0,
            house,
            258 | (helio === true ? 8 : 0),
            2 | 1
          )
            .then((wasm2Re: WasmType) => {
              calculatePlanetState(wasm2Re);
              if (chartType === "SolarArc") {
                const dif = wasm2Re.planets["0"].lon - wasmRe.planets["0"].lon;
                Object.entries(wasmRe.planets).forEach(
                  ([planetIndex, planetInfo]) => {
                    wasm2Re.planets[planetIndex] = deepCopy(planetInfo);
                    wasm2Re.planets[planetIndex].lon =
                      (planetInfo.lon + dif + 360) % 360;
                  }
                );
                wasm2Re.house = deepCopy(wasmRe.house);
              }
              setWasm2(wasm2Re);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error
      });
  }, [dateTime, location, helio, house, sidMode, siderealOrTropical]);
  useEffect(() => {
    if (chartType !== "Natal" && wasm) {
      const secondDateTime =
        chartType === "Transit"
          ? dateTimeTransit
          : dateTime.plus({
              millisecond:
                dateTimeTransit.diff(dateTime).milliseconds / 365.24217,
            });
      astrologer(
        timestamp2jdut(secondDateTime.toMillis()),
        siderealOrTropical === false ? -1 : Number(sidMode),
        locationSame === "same"
          ? location.longitude
          : locationTransit.longitude,
        locationSame === "same" ? location.latitude : locationTransit.latitude,
        0,
        house,
        258 | (helio === true ? 8 : 0),
        2 | 1
      )
        .then((wasm2Re: WasmType) => {
          calculatePlanetState(wasm2Re);
          if (chartType === "SolarArc") {
            const dif = wasm2Re.planets["0"].lon - wasm.planets["0"].lon;
            Object.entries(wasm.planets).forEach(
              ([planetIndex, planetInfo]) => {
                wasm2Re.planets[planetIndex] = deepCopy(planetInfo);
                wasm2Re.planets[planetIndex].lon =
                  (planetInfo.lon + dif + 360) % 360;
              }
            );
            wasm2Re.house = deepCopy(wasm.house);
          }
          setWasm2(wasm2Re);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [dateTimeTransit, locationTransit, chartType]);
  if (wasm) {
    if (chartType !== "natal" && outerChartOnly == " only") {
      wasm.retype = (wasm.retype >> 1) << 1;
    } else {
      wasm.retype = wasm.retype | 1;
    }
  }
  // if (wasm2){
  //   if (chartType === "Natal") {
  //     wasm2.retype = wasm2.retype | 1;
  //   }else{
  //     wasm2.retype = (wasm2.retype >> 1) << 1;
  //   }
  // }
  return (
    <div>
      {wasm && (
        <ChartDrawingWrapper
          wasm={wasm}
          wasm2={chartType === "Natal" ? null : wasm2}
        >
          {chartType === "Natal" && (
            <MoonRelatedInfo wasm={wasm} weekday={dateTime.weekday} />
          )}
          <div className={classes.chartTopleft}>
            <ModalButton
              buttonText={`${chartType}${
                chartType === "Natal" ? "" : outerChartOnly
              }`}
              modalHeading="Chart Type (Outer Wheel)"
            >
              <RadioGroup
                option={chartType}
                options={{
                  Natal: "None (only natal chart)",
                  Transit: "Transit (also comparison)", //1<<12 (4096)
                  Secondary: "Secondary Progression: 1 day is 1 year", //2<<12
                  SolarArc: "Solar Arc", //3 << 12
                  // solarReturn: "Solar Return",
                  // lunarReturn: "Lunar Return",
                }}
                setOption={setChartType}
                inputLabel=""
                direction="vertical"
              />
              <Checkbox
                checked={outerChartOnly === " only"} //2048
                onChange={(event) =>
                  setOuterChartOnly(event.currentTarget.checked ? " only" : "")
                }
                label=" hide inner chart (hide natal chart)"
                disabled={chartType === "Natal"}
                className={classes.checkboxModelButton}
              />
              <Checkbox
                checked={locationSame !== "same"} //2048
                onChange={(event) =>
                  setLocationSame(
                    event.currentTarget.checked ? "different" : "same"
                  )
                }
                label=" location different from natal chart"
                disabled={chartType === "Natal"}
                className={classes.checkboxModelButton}
              />
            </ModalButton>
          </div>
          {chartType !== "Natal" && (
            <TimeLocationDisplay
              dateTime={dateTimeTransit}
              location={locationTransit}
              setDateTime={setDateTimeTransit}
              setLocation={setLocationTransit}
              transit={locationSame}
            />
          )}
        </ChartDrawingWrapper>
      )}
    </div>
  );
}
