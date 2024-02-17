import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { DateTime } from "luxon";
import TimeLocationDisplay from "../components/TimeLocationDisplay";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
export type DateTimeT = DateTime;
export type Location = { longitude: number; latitude: number };
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
const locationAtom = atomWithStorage("location", { longitude: 0, latitude: 0 });
export default function Root() {
  const locationURL = useLocation();
  //Natal
  const [dateTime, setDateTime] = useState(DateTime.now());
  const [location, setLocation] = useAtom(locationAtom);
  //Setting
  // const now = DateTime.fromObject({
  //   year: -1112,
  //   month: 1,
  //   day: 1,
  // });
  // // new Intl.DateTimeFormat("zh-tw-u-ca-chinese", { year: "2-digit" }).format(
  // //   dateTime.toJSDate()
  // // );
  // console.log(
  //   now
  //     .reconfigure({ locale: "zh-tw", outputCalendar: "chinese" })
  //     .toLocaleString()
  // );
  // console.log(
  //   new Intl.DateTimeFormat("en-u-ca-gregory", { dateStyle: "full" }).format(
  //     now.toJSDate()
  //   )
  // );
  // console.log(now.toJSDate());
  // console.log(
  //   now
  //     .reconfigure({ locale: "zh-cn", outputCalendar: "japanese" })
  //     .toLocaleString()
  // );
  // console.log(
  //   now
  //     .reconfigure({ locale: "zh-cn", outputCalendar: "persian" })
  //     .toLocaleString()
  // );
  // console.log(
  //   "use Intl",
  //   now
  //     .reconfigure({ locale: "ja-JP", outputCalendar: "chinese" })
  //     .toLocaleString()
  // );
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {locationURL.pathname !== "/" && <Navigation location={locationURL} />}
      <TimeLocationDisplay
        dateTime={dateTime}
        location={location}
        setDateTime={setDateTime}
      />
      {/* wrap by settings*/}
      {/* no, use jotai and settings only affect the leafs. leave the root clean */}
      <Outlet context={[dateTime, setDateTime, location, setLocation]} />
    </div>
  );
}
