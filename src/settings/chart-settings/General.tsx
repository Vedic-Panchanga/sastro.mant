import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import TabsTwo from "../../components/TabsTwo";
import SelectDropdown from "../../components/SelectDropdown";
// import TabsThree from "../../components/TabsThree";

const defaultSettings = {
  nodeType: false,
  lilithType: 0,
  helio: false,
  siderealOrTropical: false,
  sidMode: "0",
  house: "K",
};

const createAtom = <T extends keyof typeof defaultSettings>(key: T) =>
  atomWithStorage(key, defaultSettings[key]);

// export const nodeTypeAtom = createAtom("nodeType");
// export const lilithTypeAtom = createAtom("lilithType");
export const helioAtom = createAtom("helio");
export const siderealOrTropicalAtom = createAtom("siderealOrTropical");
export const sidModeAtom = createAtom("sidMode");
export const houseAtom = createAtom("house");

export default function ChartGeneralSettings() {
  // const [nodeType, setNodeType] = useAtom(nodeTypeAtom);
  // const [lilithType, setLilithType] = useAtom(lilithTypeAtom);
  const [helio, setHelio] = useAtom(helioAtom);
  const [siderealOrTropical, setSiderealOrTropical] = useAtom(
    siderealOrTropicalAtom
  );
  const [sidMode, setSidMode] = useAtom(sidModeAtom);
  const [house, setHouse] = useAtom(houseAtom);
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
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <SelectDropdown
          option={sidMode}
          inputLabel="Sidereal Mode"
          setOption={setSidMode}
          options={sidOptions}
        />
        <SelectDropdown
          option={house}
          inputLabel="House"
          setOption={setHouse}
          options={houseOptions}
        />
      </div>
    </>
  );
}
