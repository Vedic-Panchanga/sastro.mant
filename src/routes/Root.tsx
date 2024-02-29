import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Navigation from "./Navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateTime, FixedOffsetZone } from "luxon";
import TimeLocationDisplay from "../components/TimeLocationDisplay";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import Footer from "../Footer";
export type DateTimeT = DateTime;
export type Location = { longitude: number; latitude: number; height: number };
type SetLocation = Dispatch<SetStateAction<Location>>;
type SetTime = Dispatch<SetStateAction<DateTime>>;
export type SetLocationObj = {
  setLocation: SetLocation;
};
export type SetDateTimeObj = {
  setDateTime: SetTime;
};
export type DateTimeLocationObj = {
  dateTime: DateTime;
  location: Location;
};

export type TimeLocationSetTuple = [DateTime, SetTime, Location, SetLocation];
const locationAtom = atomWithStorage("location", {
  longitude: 0,
  latitude: 0,
  height: 0,
});
export default function Root() {
  const locationURL = useLocation();
  //Natal
  const [dateTime, setDateTime] = useState(DateTime.now());
  const [location, setLocation] = useAtom(locationAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const ts = searchParams.get("ts");
    const offset = searchParams.get("offset");
    const lon = searchParams.get("lon");
    const lat = searchParams.get("lat");
    const height = searchParams.get("height");
    // const height = searchParams.get('height')
    if (!(ts === null) && !(ts === undefined)) {
      const offsetToUse = offset ?? dateTime.offset;
      const zone = FixedOffsetZone.instance(Number(offsetToUse));
      const newDateTime = DateTime.fromMillis(Number(ts) ?? 0, { zone: zone });
      if (newDateTime.isValid) setDateTime(newDateTime);
      console.log("inside", ts, "newTime", newDateTime);
    }
    console.log("outside", ts, !ts === null, !ts === undefined);

    if (!(lon === null) && !(lon === undefined)) {
      // console.log("Inside", location);
      setLocation((prev) => ({ ...prev, longitude: Number(lon) }));
    }
    if (!lat === null && !lat === undefined) {
      setLocation((prev) => ({ ...prev, latitude: Number(lat) }));
    }
    if (!height === null && !height === undefined) {
      setLocation((prev) => ({ ...prev, height: Number(height) }));
    }
    setSearchParams(undefined);
  }, [searchParams, setSearchParams, setLocation]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {locationURL.pathname !== "/" && <Navigation location={locationURL} />}
      {locationURL.pathname !== "/calendar" && (
        <TimeLocationDisplay
          dateTime={dateTime}
          location={location}
          setDateTime={setDateTime}
        />
      )}

      {/* wrap by settings*/}
      {/* no, use jotai and settings only affect the leafs. leave the root clean */}
      <Outlet context={[dateTime, setDateTime, location, setLocation]} />
      <div>
        <Footer />
      </div>
    </div>
  );
}
