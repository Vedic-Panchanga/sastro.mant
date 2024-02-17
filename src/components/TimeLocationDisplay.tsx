import { useState } from "react";
import { NativeSelect } from "@mantine/core";
import ModalButton from "./ModalButton";
import { type DateTimeLocationObj, type SetDateTimeObj } from "../routes/Root";
import { ActionIcon } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import classes from "./TimeLocationDisplay.module.css";
function formatLocation(location: { longitude: number; latitude: number }) {
  const ew = location.longitude >= 0 ? "E" : "W";
  const ns = location.latitude >= 0 ? "N" : "S";
  return (
    <div className={classes["lon-lat"]}>
      <span>
        <strong>Lon</strong>
        {`: ${Math.abs(location.longitude).toFixed(2)} ${ew} `}
      </span>
      <span>
        <strong>Lat</strong>
        {`: ${Math.abs(location.latitude).toFixed(2)} ${ns} `}
      </span>
    </div>
  );
}
export default function TimeLocationDisplay({
  dateTime,
  setDateTime,
  location,
}: DateTimeLocationObj & SetDateTimeObj) {
  const [number, setNumber] = useState<string>("1");
  const [unit, setUnit] = useState<string>("day");
  function addOrMinusTime(sign: number) {
    setDateTime((prev) => prev.plus({ [unit]: sign }));
  }
  return (
    <div className={classes.container}>
      <div className={classes.text}>
        {dateTime.toFormat("yyyy-MM-dd HH:mm:ss Z EEE")}
        {formatLocation(location)}
      </div>
      <div className={classes.buttons}>
        <ActionIcon
          onClick={() => addOrMinusTime(-1)}
          size="xs"
          variant="default"
        >
          <IconMinus />
        </ActionIcon>
        <ModalButton
          modalHeading="Jump Rate"
          buttonText={`${number}
              ${
                {
                  second: "sec",
                  minute: "min",
                  hour: "hour",
                  day: "day",
                  month: "mon",
                  year: "year",
                }[unit]
              }`}
        >
          <div className={classes.selects}>
            <NativeSelect
              size="sm"
              onChange={(event) => setNumber(event.currentTarget.value)}
              data={["1", "2", "3", "4", "5", "6", "7"]}
              value={number}
            />

            <NativeSelect
              size="sm"
              onChange={(event) => setUnit(event.currentTarget.value)}
              value={unit}
              data={["second", "minute", "hour", "day", "month", "year"]}
            />
          </div>
        </ModalButton>
        <ActionIcon
          onClick={() => addOrMinusTime(1)}
          size="xs"
          variant="default"
        >
          <IconPlus />
        </ActionIcon>
      </div>
    </div>
  );
}
