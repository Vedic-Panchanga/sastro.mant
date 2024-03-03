import { useState } from "react";
import { DateTime, FixedOffsetZone } from "luxon";
import { ActionIcon, Button } from "@mantine/core";

import ModalButtonGeocode from "./ModalButtonGeocode";
import BaseTextField from "./BaseTextField";
import {
  type SetDateTimeLocationObj,
  type DateTimeLocationObj,
} from "../routes/Root";
import classes from "./TimeLocationSheet.module.css";
import {
  IconLetterE,
  IconLetterW,
  IconLetterN,
  IconLetterS,
} from "@tabler/icons-react";

// Define constants
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_MINUTE = 60;
// const DIRECTION = {
//   EAST_WEST: "eastWest",
//   NORTH_SOUTH: "northSouth",
// };
export default function TimeLocationSheet({
  dateTime,
  setDateTime,
  location,
  setLocation,
  transit, //undefined, "same", "different"
}: DateTimeLocationObj & SetDateTimeLocationObj & { transit?: string }) {
  const [inputValues, setInputValues] = useState({
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    second: "",
    timeZone: "",
    lonDeg: "",
    latDeg: "",
    lonMin: "",
    lonSec: "",
    latMin: "",
    latSec: "",
    // ew: location.longitude >= 0,
    // ns: location.latitude >= 0,
    height: "",
  });

  const [locationDirection, setLocationDirection] = useState({
    eastWest: location.longitude >= 0,
    northSouth: location.latitude >= 0,
  });

  const regex = /^[-0-9.]*$/;
  function handleInputChange(identifier: string, value: string) {
    // const value = e.target.value;
    if (regex.test(value) || value === "") {
      setInputValues((prevValues) => ({
        ...prevValues,
        [identifier]: value,
      }));
    }
  }
  function handleLocationDirectionChange(
    identifier: "eastWest" | "northSouth"
  ) {
    setLocationDirection((prevValues) => ({
      ...prevValues,
      [identifier]: !prevValues[identifier],
    }));
  }
  function handleSubmit() {
    // e.preventDefault(); // 阻止表單的默認提交行為
    //dateTime
    const parsedYear = parseInt(inputValues.year);
    const parsedMonth = parseInt(inputValues.month);
    const parsedDay = parseFloat(inputValues.day);
    const parsedHour = parseFloat(inputValues.hour);
    const parsedMinute = parseFloat(inputValues.minute);
    const parsedSecond = parseInt(inputValues.second);
    const parsedTimeZone = parseFloat(inputValues.timeZone);

    const updatedDateTime = DateTime.fromObject(
      {
        year: isNaN(parsedYear) ? dateTime.year : parsedYear,
        month: isNaN(parsedMonth) ? dateTime.month : parsedMonth,
        day: isNaN(parsedDay) ? dateTime.day : parsedDay,
        hour: isNaN(parsedHour) ? dateTime.hour : parsedHour, // 时、分、秒等属性可以根据需要添加
        minute: isNaN(parsedMinute) ? dateTime.minute : parsedMinute,
        second: isNaN(parsedSecond) ? dateTime.second : parsedSecond,
      },
      {
        zone: FixedOffsetZone.instance(
          isNaN(parsedTimeZone) ? dateTime.offset : parsedTimeZone * 60
        ),
      }
    );

    if (updatedDateTime.isValid) {
      const takeFractionalHour = updatedDateTime.plus({
        seconds:
          ((parseFloat(inputValues.hour) || 0) % 1) * SECONDS_IN_HOUR +
          ((parseFloat(inputValues.day) || 0) % 1) * SECONDS_IN_DAY +
          ((parseFloat(inputValues.minute) || 0) % 1) * SECONDS_IN_MINUTE,
      });
      setDateTime(takeFractionalHour);
    }
    //location
    let longitude = location.longitude;
    if (
      inputValues.lonDeg !== "" ||
      inputValues.lonMin !== "" ||
      inputValues.lonSec !== ""
    ) {
      longitude =
        ((inputValues.lonDeg !== ""
          ? parseFloat(inputValues.lonDeg)
          : Math.abs(location.longitude)) +
          (parseFloat(inputValues.lonMin) || 0) / 60 +
          (parseFloat(inputValues.lonSec) || 0) / 3600) *
        (locationDirection.eastWest ? 1 : -1);
      if (longitude > 180 || longitude < -180) {
        alert(
          "The longitude should be in the range [-180, 180], with east being positive.\nOtherwise, it would be set to zero."
        );
        longitude = 0;
      }
    }
    let latitude = location.latitude;
    if (
      inputValues.latDeg !== "" ||
      inputValues.latMin !== "" ||
      inputValues.latSec !== ""
    ) {
      latitude =
        ((inputValues.latDeg !== ""
          ? parseFloat(inputValues.latDeg)
          : Math.abs(location.latitude)) +
          (parseFloat(inputValues.latMin) || 0) / 60 +
          (parseFloat(inputValues.latSec) || 0) / 3600) *
        (locationDirection.northSouth ? 1 : -1);
      if (latitude > 90 || latitude < -90) {
        alert(
          "The latitude should be in the range [-90, 90], with north being positive.\nOtherwise, it would be set to zero."
        );
        latitude = 0;
      }
    }
    const height =
      inputValues.height !== ""
        ? parseFloat(inputValues.height)
        : location.height;

    setLocation({ longitude, latitude, height });
    handleClear(longitude, latitude);
  }
  function handleClear(
    longitude = location.longitude,
    latitude = location.latitude
  ) {
    setInputValues({
      year: "",
      month: "",
      day: "",
      hour: "",
      minute: "",
      second: "",
      timeZone: "",
      lonDeg: "",
      latDeg: "",
      lonMin: "",
      lonSec: "",
      latMin: "",
      latSec: "",
      height: "",
    });
    setLocationDirection({
      eastWest: longitude >= 0,
      northSouth: latitude >= 0,
    });
  }
  function handleSetToNow() {
    // const nowTime = DateTime.now();
    setDateTime(DateTime.now());
    handleClear();
  }

  return (
    <div style={{ width: "fit-content", margin: "auto" }}>
      {/* year month day */}
      <div className={classes.stack}>
        <BaseTextField
          identifier="year"
          placeHolder={dateTime["year"].toString()}
          handleInputChange={handleInputChange}
          value={inputValues["year"]}
        />
        <BaseTextField
          identifier="month"
          placeHolder={dateTime["month"].toString()}
          handleInputChange={handleInputChange}
          value={inputValues["month"]}
        />
        <BaseTextField
          identifier="day"
          placeHolder={dateTime["day"].toString()}
          handleInputChange={handleInputChange}
          value={inputValues["day"]}
        />
      </div>
      {/* hour minute second */}
      <div className={classes.stack}>
        <BaseTextField
          identifier="hour"
          placeHolder={dateTime["hour"].toString()}
          handleInputChange={handleInputChange}
          value={inputValues["hour"]}
        />
        <BaseTextField
          identifier="minute"
          placeHolder={dateTime["minute"].toString()}
          handleInputChange={handleInputChange}
          value={inputValues["minute"]}
        />
        <BaseTextField
          identifier="second"
          placeHolder={dateTime["second"].toString()}
          handleInputChange={handleInputChange}
          value={inputValues["second"]}
        />
      </div>
      {/* utc */}
      <div className={classes.stack}>
        <BaseTextField
          identifier="timeZone"
          placeHolder={dateTime.toFormat("Z")}
          handleInputChange={handleInputChange}
          value={inputValues["timeZone"]}
        />
        <small>
          Gregorian Calendar
          <br />
          {transit !== "same" && "Height in meter"}
        </small>
        {transit !== "same" && (
          <BaseTextField
            identifier="height"
            placeHolder={location.height.toString()}
            handleInputChange={handleInputChange}
            value={inputValues["height"]}
          />
        )}
      </div>
      {/* lon */}
      {/* lat */}
      {transit !== "same" && (
        <div className={classes.stack}>
          <div className={classes.lineNoLabel}>
            <div className={classes.stack}>
              <div className={classes.mono}>Lon</div>
              <ActionIcon
                size="sm"
                variant="light"
                onClick={() => handleLocationDirectionChange("eastWest")}
              >
                {locationDirection.eastWest ? <IconLetterE /> : <IconLetterW />}
              </ActionIcon>

              <BaseTextField
                identifier="lonDeg"
                maxWidth="100px"
                value={inputValues["lonDeg"]}
                placeHolder={Math.abs(location.longitude).toString()}
                rightSection="°"
                handleInputChange={handleInputChange}
                lableShown={false}
              />
              <BaseTextField
                identifier="lonMin"
                maxWidth="100px"
                value={inputValues["lonMin"]}
                placeHolder="0"
                rightSection="′"
                handleInputChange={handleInputChange}
                lableShown={false}
              />
              <BaseTextField
                identifier="lonSec"
                maxWidth="100px"
                value={inputValues["lonSec"]}
                placeHolder="0"
                rightSection="″"
                handleInputChange={handleInputChange}
                lableShown={false}
              />
            </div>
            <div className={classes.stack}>
              <div className={classes.mono}>Lat</div>
              <ActionIcon
                onClick={() => handleLocationDirectionChange("northSouth")}
                size="sm"
                variant="light"
              >
                {locationDirection.northSouth ? (
                  <IconLetterN />
                ) : (
                  <IconLetterS />
                )}
              </ActionIcon>
              <BaseTextField
                identifier="latDeg"
                maxWidth="100px"
                value={inputValues["latDeg"]}
                placeHolder={Math.abs(location.latitude).toString()}
                rightSection="°"
                handleInputChange={handleInputChange}
                lableShown={false}
              />
              <BaseTextField
                identifier="latMin"
                maxWidth="100px"
                value={inputValues["latMin"]}
                placeHolder="0"
                rightSection="′"
                handleInputChange={handleInputChange}
                lableShown={false}
              />
              <BaseTextField
                identifier="latSec"
                maxWidth="100px"
                value={inputValues["latSec"]}
                placeHolder="0"
                rightSection="″"
                handleInputChange={handleInputChange}
                lableShown={false}
              />
            </div>
          </div>
          <ModalButtonGeocode setLocation={setLocation} />
        </div>
      )}

      <div className={`${classes.stack} ${classes.buttons}`}>
        <Button onClick={handleSubmit}>Set Time/Locations</Button>
        <Button onClick={() => handleClear()} className="mx-3">
          Clear
        </Button>
        <Button onClick={handleSetToNow}>Now</Button>
      </div>
    </div>
  );
}
