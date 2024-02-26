import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import SVGVedic from "./SVGVedic.js";
import { TabVedic } from "./VedicRelated.js";
import astrologer from "../astrologer.js";
import { timestamp2jdut } from "../utils.js";
import { type DateTimeT, Location } from "../routes/Root.js";
// import { type Planet } from "../routes/Chart";
import TabsTwo from "../components/TabsTwo.js";
import SelectDropdown from "../components/SelectDropdown.js";
import classes from "../chart-components/ChartDrawingWrapper.module.css";
export type Planet = {
  name: string;
  lon: number;
  speed: number;
  shown: boolean;
}; //especially for groupPlanetsByWholeHouse
export default function Vedic() {
  // hooks
  const [dateTime, , location]: [DateTimeT, never, Location] =
    useOutletContext();

  //Consts
  const sidOptions = {
    0: "Fagan/Bradley",
    1: "Lahiri",
    27: "True Citra",
    3: "Raman",
    7: "Yukteshwar",
    30: "Galactic Center (Gil Brand)",
    29: "True Pushya (PVRN Rao)",
  };
  //Hooks
  const [siderealOrTropical, setSiderealOrTropical] = useState(true); //false: tropical, true: sidereal
  const [sidMode, setSidMode] = useState("27"); //swe_set_sid_mode
  const [wasm, setWasm] = useState<null | {
    planets: Record<string, Planet>;
    house: number[];
  }>(null);
  //Calc
  useEffect(() => {
    astrologer(
      timestamp2jdut(dateTime.toMillis()),
      siderealOrTropical === false ? -1 : Number(sidMode),
      location.longitude,
      location.latitude,
      location.height,
      "W",
      258,
      1 | 64
    )
      .then((wasm) => {
        delete wasm.planets[7];
        delete wasm.planets[8];
        delete wasm.planets[9];
        setWasm(wasm);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error
      });
  }, [dateTime, location, sidMode, siderealOrTropical]);

  const planetState = wasm?.planets;
  return (
    planetState && (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <TabsTwo
            option={siderealOrTropical}
            setOption={setSiderealOrTropical}
            optionLabel={["Tropical", "Sidereal"]}
          />
          <SelectDropdown
            setOption={setSidMode}
            options={sidOptions}
            option={sidMode}
            inputLabel="Sidereal Type"
          />
        </div>
        <VedicDrawingWrapper planetState={planetState} dateTime={dateTime} />
      </div>
    )
  );
}
function VedicDrawingWrapper({
  planetState,
  dateTime,
}: {
  planetState: Record<string, Planet>;
  dateTime: DateTimeT;
}) {
  // const [nodeType, setNodeType] = useState(false); //false: "mean", true: "true"

  // const nodeIndex = nodeType ? 11 : 10;
  // const nodeIndexOther = nodeType ? 10 : 11;
  const nodeIndex = 10; //suppose we only use mean node
  const nodeIndexOther = 11;
  planetState[nodeIndex].shown = true;
  planetState[nodeIndexOther].shown = false;

  planetState[nodeIndex].name = "Rahu";
  planetState[nodeIndexOther].name = "Rahu";

  planetState[nodeIndex + 100] = {
    name: "Ketu",
    lon: (180 + planetState[nodeIndex].lon) % 360,
    speed: planetState[nodeIndex].speed,
    shown: true,
  };
  planetState[nodeIndexOther + 100] = {
    name: "Ketu",
    lon: (180 + planetState[nodeIndexOther].lon) % 360,
    speed: planetState[nodeIndexOther].speed,
    shown: false,
  };
  return (
    <div className={classes.container}>
      {/* <div>
        Node:{" "}
        <TabsTwo
          option={nodeType}
          setOption={setNodeType}
          optionLabel={["true", "mean"]}
        />
      </div> */}
      <SVGVedic planetState={planetState} />
      <TabVedic planetState={planetState} dateTime={dateTime} />
    </div>
  );
}
