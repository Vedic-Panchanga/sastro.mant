import TimeLocationSheet from "../components/TimeLocationSheet";
import { type TimeLocationSetTuple } from "./Root";
import { Link, useOutletContext } from "react-router-dom";
import classes from "./Entry.module.css";
import { Anchor, Button, Divider } from "@mantine/core";

export default function Entry() {
  const [dateTime, setDateTime, location, setLocation]: TimeLocationSetTuple =
    useOutletContext();

  return (
    <div className={classes.container}>
      <TimeLocationSheet
        dateTime={dateTime}
        location={location}
        setDateTime={setDateTime}
        setLocation={setLocation}
      />
      <Divider my="md" />
      <div className={classes.stacklink}>
        <strong>Astrology</strong>
        <Button color="red" to="/sschart" component={Link}>
          CHART
        </Button>
        <Button color="red" to="/ssvedic" component={Link}>
          VEDIC
        </Button>
        <Button color="red" to="/ssbazi" component={Link}>
          BAZI
        </Button>
      </div>
      <div className={classes.stacklink}>
        <strong>Calendar</strong>
        <Button color="red" to="/sscalendar" component={Link}>
          CALENDAR
        </Button>
      </div>

      <div>
        {/* <strong>Tools</strong> */}
        <Anchor href="/tools/index.html">Tools List</Anchor>
        <br />
        Quick access to some useful ones:
        <li>
          <Anchor href="/tools/julian.html">Julian Day Number</Anchor>
          <br />
          (converter with timestamp, Gregorian calendar)
        </li>{" "}
        <li>
          <Anchor href="/tools/chartreverse.html">Chart Reverse</Anchor>{" "}
        </li>
        <li>
          <Anchor href="/tools/bazire.html">Bazi Reverse (八字反推)</Anchor>{" "}
        </li>
      </div>
    </div>
  );
}
