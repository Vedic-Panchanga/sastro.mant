import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Navigation from "./Navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateTime, FixedOffsetZone } from "luxon";
import TimeLocationDisplay from "../components/TimeLocationDisplay";
import { atomWithStorage } from "jotai/utils";
import { useAtom, useSetAtom } from "jotai";
import { lmtOrLatAtom } from "../bazi-components/Bazi";
import Footer from "../Footer";
import astrologer from "../astrologer";
import { Loader } from "@mantine/core";
import classes from "./Root.module.css";
export type DateTimeT = DateTime;
export type Location = { longitude: number; latitude: number; height: number };
export type SetLocation = Dispatch<SetStateAction<Location>>;
type SetTime = Dispatch<SetStateAction<DateTime>>;
export type SetLocationObj = {
  setLocation: SetLocation;
};
export type SetDateTimeLocationObj = {
  setDateTime: SetTime;
  setLocation: SetLocation;
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
  const [searchParams] = useSearchParams();
  const setLmtOrLatAtom = useSetAtom(lmtOrLatAtom);
  //loading
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    astrologer(1, -1, 0, 0, 0, "P", 258, 0).then(() => {
      setLoaded(true);
      console.log("Astrology data loaded");
    });
  }, []);
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
      // console.log("inside", ts, "newTime", newDateTime);
    }
    // console.log("outside", ts, offset, lon, lat, height);
    type LocationParam = {
      longitude?: number;
      latitude?: number;
      height?: number;
    };
    const newLocation: Partial<LocationParam> = {};
    if (!(lon === null) && !(lon === undefined)) {
      // console.log("Inside", location);
      newLocation.longitude = Number(lon);
      // setLocation((prev) => ({ ...prev, longitude: Number(lon) }));
    }
    if (!(lat === null) && !(lat === undefined)) {
      newLocation.latitude = Number(lat);
      // setLocation((prev) => ({ ...prev, latitude: Number(lat) }));
    }
    if (!(height === null) && !(height === undefined)) {
      newLocation.height = Number(height);
      // setLocation((prev) => ({ ...prev, height: Number(height) }));
    }
    // console.log("insideLocation", newLocation, { ...location, ...newLocation });
    setLmtOrLatAtom(false); //suppose we use LAT (since that is how the value passed)
    setLocation((prev) => ({ ...prev, ...newLocation }));
    // setSearchParams(undefined);
  }, [searchParams]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {locationURL.pathname !== "/" && <Navigation location={locationURL} />}
      {locationURL.pathname !== "/sscalendar" && (
        <TimeLocationDisplay
          dateTime={dateTime}
          location={location}
          setDateTime={setDateTime}
          setLocation={setLocation}
        />
      )}
      {loaded && (
        <Outlet context={[dateTime, setDateTime, location, setLocation]} />
      )}
      {!loaded && <Loader type="dots" className={classes.loading} />}
      <Footer />
    </div>
  );
}
