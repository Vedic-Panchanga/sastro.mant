import { useAtom } from "jotai";
import TabsTwo from "../../components/TabsTwo";
import SelectDropdown from "../../components/SelectDropdown";
import ExplainNak from "./ExplainNak";

// import TabsThree from "../../components/TabsThree";
import classes from "./General.module.css";
import {
  helioAtom,
  siderealOrTropicalAtom,
  sidModeAtom,
  houseAtom,
  subWheelTypeAtom,
} from "../../chart-components/Chart";

export default function ChartGeneralSettings() {
  // const [nodeType, setNodeType] = useAtom(nodeTypeAtom);
  // const [lilithType, setLilithType] = useAtom(lilithTypeAtom);
  const [helio, setHelio] = useAtom(helioAtom);
  const [siderealOrTropical, setSiderealOrTropical] = useAtom(
    siderealOrTropicalAtom
  );
  const [sidMode, setSidMode] = useAtom(sidModeAtom);
  const [house, setHouse] = useAtom(houseAtom);
  const [subWheelType, setSubWheelType] = useAtom(subWheelTypeAtom);

  const sidOptions = {
    0: "Fagan/Bradley",
    1: "Lahiri",
    27: "True Citra",
    3: "Raman",
    7: "Yukteshwar",
    30: "Galactic Center (Gil Brand)",
    29: "True Pushya (PVRN Rao)",
  };
  const houseOptions = {
    P: "Placidus",
    K: "Koch",
    B: "Alcabitus",
    E: "Equal",
    W: "Whole sign",
    R: "Regiomontanus",
    C: "Campanus",
  };
  const subWheelOptions = {
    0: "None",
    28: "28 Xiu",
    27: "27 Nakshatra",
  };

  return (
    <>
      {/* <TabsTwo
        option={nodeType} //false: mean node, true: true node
        setOption={setNodeType}
        optionLabel={["mean node", "true node"]}
      />
      <TabsThree
        option={lilithType} //false: mean lilith, true: true lilith
        setOption={setLilithType}
        optionLabel={[
          { value: "0", label: "mean lilith" },
          { value: "1", label: "true lilith" },
          { value: "2", label: "interpolated" },
        ]}
      /> */}
      <TabsTwo
        option={helio} //false: geocentric, true: heliocentric
        setOption={setHelio}
        optionLabel={["geocentric", "heliocentric"]}
      />
      <TabsTwo
        option={siderealOrTropical} //false: tropical, true: sidereal
        setOption={setSiderealOrTropical}
        optionLabel={["tropical", "sidereal"]}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div className={classes.sidMode}>
          <SelectDropdown
            option={sidMode}
            inputLabel="Sidereal Mode"
            setOption={setSidMode}
            options={sidOptions}
          />
        </div>
        <SelectDropdown
          option={house}
          inputLabel="House"
          setOption={setHouse}
          options={houseOptions}
        />{" "}
        <SelectDropdown
          option={subWheelType}
          inputLabel={
            <>
              Sub Wheel
              <ExplainNak />
            </>
          }
          setOption={setSubWheelType}
          options={subWheelOptions}
        />
      </div>
    </>
  );
}
