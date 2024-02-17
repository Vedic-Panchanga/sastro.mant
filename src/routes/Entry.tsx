import TimeLocationSheet from "../components/TimeLocationSheet";
import { type TimeLocationSetTuple } from "./Root";
import { useOutletContext } from "react-router-dom";
export default function Entry() {
  const [dateTime, setDateTime, location, setLocation]: TimeLocationSetTuple =
    useOutletContext();
  return (
    <TimeLocationSheet
      dateTime={dateTime}
      location={location}
      setDateTime={setDateTime}
      setLocation={setLocation}
    />
  );
}
