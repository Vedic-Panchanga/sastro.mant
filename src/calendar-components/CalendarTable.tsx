import {
  day2GanzhiChar,
  jdut2DateTime,
  jieqiList,
  planetsSymbol,
  timestamp2jdlocal,
  timestamp2jdut,
} from "../utils";

import { Table, Tabs, Tooltip } from "@mantine/core";
import { Location, type DateTimeT } from "../routes/Root";
import classes from "./CalendarTable.module.css";
import { useEffect, useRef, useState } from "react";
import { FixedOffsetZone } from "luxon";
import ExplainCalendar from "./ExplainCalendar";
import astrologer from "../astrologer";
import EventsCalendar from "./EventsCalendar";
import RiseSet from "./RiseSet";
import ExplainRiseSet from "./ExplainRiseSet";
import ExplainEvents from "./ExplainEvents";

export type EventType = {
  jd: number; //when
  name: number; //number, since we would like to use planets' symbols
  type?: string; //what, number, look the numbers up in the table
  value: string | number; //where. =>where does it happen or the magnitude
  // display?: string; // normally: concat: "jd  name + type  value", but some use display directly, like "display  value" (display like new moon)
};
const DAYS = 7;

export default function CalendarTable({
  selectedDate,
  setSelectedDate,
  location,
}: {
  selectedDate: DateTimeT;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateTimeT>>;
  location: Location;
}) {
  const calendarArray: (number | null)[][] = [];
  const days = selectedDate.daysInMonth;
  const daysArraySubTitle: string[] | null = new Array(days! + 1).fill(null);
  const daysArrayEvents = Array.from(
    { length: days! + 1 },
    () => []
  ) as EventType[][];

  const firstDayOfMonth = selectedDate.set({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  //first day of month noon jd local (in convenience to calc other jd locals)
  const firstDayOfMonthJDLocal = timestamp2jdlocal(
    firstDayOfMonth.set({ hour: 12 }).toMillis(),
    firstDayOfMonth.offset
  );
  const [wasm, setWasm] = useState<Record<string, Array<number[]>>>({});
  const [riseSet, setRiseSet] = useState<{
    day_sunrise: number[];
    day_moonrise: number[];
  } | null>(null);
  const yearRef = useRef<number>(-14001);
  //apply the calculation
  useEffect(() => {
    // if the year change?
    // if yearRef is -14000, then it has to be true (need calc)
    // else check whether it is equal to the current selected year
    const yearChange = yearRef.current !== selectedDate.year;
    // console.log("yearChange", yearChange, yearRef.current, selectedDate.year);
    astrologer(
      timestamp2jdut(selectedDate.toMillis()),
      -1,
      location.longitude,
      location.latitude,
      location.height,
      "P",
      258,
      (yearChange ? 512 : 0) | 256 | (selectedDate.month > 6 ? 1024 : 0) //if year change, calculate the major data,
    )
      .then((wasmRe) => {
        if (yearChange) {
          setWasm(wasmRe);
        }
        setRiseSet(wasmRe);
        yearRef.current = selectedDate.year;
        // console.log(wasmRe);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error
      });
  }, [selectedDate, location]);
  // console.log("wasmCalendarMonth", wasm);
  // console.log("wasmCalendarMonth", wasmRaw);
  // const wasm = JSON.parse(wasmRaw);

  // add the jieqi and moons
  const zone = FixedOffsetZone.instance(firstDayOfMonth.offset);
  if (wasm) {
    const days = firstDayOfMonth.daysInMonth;
    // daysArraySubTitle = new Array(days! + 1);
    // daysArrayEventsRef.current = new Array(days! + 1).fill([]);
    //inclusive, in jdut
    const startMonth = timestamp2jdut(firstDayOfMonth.toMillis());
    //exclusive, in jdut
    const endMonth = timestamp2jdut(
      firstDayOfMonth.plus({ day: days }).toMillis()
    );

    wasm.month_jieqi?.forEach((jieqiArray: [number, number] | number[]) => {
      if (jieqiArray[0] >= endMonth || jieqiArray[0] < startMonth) {
        return;
      } else {
        const jieqiDateTime = jdut2DateTime(jieqiArray[0], zone);
        daysArraySubTitle[jieqiDateTime.day] = jieqiList(Number(jieqiArray[1]));
        daysArrayEvents[jieqiDateTime.day].push({
          name: 0, //number of SUN
          jd: jieqiArray[0],
          value: jieqiArray[1],
          // display: jieqiList(Number(jieqiArray[1])),
          type: `Sun ingress ${jieqiList(Number(jieqiArray[1]))}`,
        });
      }
    });
    wasm.month_moons?.forEach(
      (moonArray: [number, number, number] | number[]) => {
        if (moonArray[0] >= endMonth || moonArray[0] < startMonth) {
          return;
        } else {
          const moonDateTime = jdut2DateTime(moonArray[0], zone);
          let moonEmoji: undefined | string = undefined;
          if (moonArray[1] == 0) {
            moonEmoji = "🌑";
          } else if (moonArray[1] == 90) {
            moonEmoji = "🌓";
          } else if (moonArray[1] == 180) {
            moonEmoji = "🌕";
          } else {
            moonEmoji = "🌗";
          }
          daysArraySubTitle[moonDateTime.day] = moonEmoji;
          daysArrayEvents[moonDateTime.day].push({
            name: 1, //number of MOON
            jd: moonArray[0],
            value: moonArray[2],
            type: moonEmoji,
          });
        }
      }
    );
    wasm.events?.forEach(
      (eventArray: [number, number, number, number] | number[]) => {
        if (eventArray[1] >= endMonth || eventArray[1] < startMonth) {
          return;
        } else {
          const eventDateTime = jdut2DateTime(eventArray[1], zone);
          daysArrayEvents[eventDateTime.day].push({
            name: eventArray[0],
            jd: eventArray[1],
            value: eventArray[3],
            type: eventLookup(eventArray[0], eventArray[2]),
          });
        }
      }
    );
  }

  //calendar skelton
  let day = 1;
  for (let i = 0; i < 6; i++) {
    if (i == 4 && days === 28 && firstDayOfMonth.weekday === 1) {
      continue;
    }
    const week: (number | null)[] = [];
    for (let j = 1; j <= DAYS; j++) {
      if ((i === 0 && j < firstDayOfMonth.weekday) || day > days!) {
        week.push(null);
      } else {
        week.push(day);
        day++;
      }
    }
    calendarArray.push(week);
    if (day > days!) break;
  }
  // console.log("after wasm", wasm);

  return (
    <>
      {wasm && (
        <>
          <Table className={classes.calendar} captionSide="top">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Sun</Table.Th>
                <Table.Th>Mon</Table.Th>
                <Table.Th>Tue</Table.Th>
                <Table.Th>Wed</Table.Th>
                <Table.Th>Thu</Table.Th>
                <Table.Th>Fri</Table.Th>
                <Table.Th>Sat</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {calendarArray.map((week, index) => (
                <Table.Tr key={index}>
                  {week.map((day, i) => {
                    if (day === null) {
                      return (
                        // day: which day (could be null), index: which week, i: which day of the week
                        <Table.Td key={day + "-" + index + "-" + i}></Table.Td>
                      );
                    }
                    const dayCalendar = selectedDate.set({
                      day: day,
                    });
                    const dayStringParts = dayCalendar
                      .setLocale("zh-tw-u-ca-chinese")
                      .toLocaleParts({
                        dateStyle: "long",
                      });
                    // console.log(dayStringParts);

                    return (
                      <Table.Td key={day + "-" + index + "-" + i}>
                        <Tooltip
                          events={{ hover: true, focus: false, touch: false }}
                          label={
                            <>
                              <div>
                                {/* {dayStringParts[1].value} */}
                                {dayStringParts[3].value}
                                {dayStringParts[4].value}
                                {day2GanzhiChar(
                                  firstDayOfMonthJDLocal + day - 1
                                )}
                              </div>
                              <div>
                                JD:{" "}
                                {(firstDayOfMonthJDLocal + day - 1).toString()}
                              </div>
                            </>
                          }
                        >
                          <div
                            className={
                              selectedDate.day === day ? classes.selected : ""
                            }
                            onClick={() => {
                              setSelectedDate(dayCalendar);
                            }}
                          >
                            {day.toString()}
                            <br />
                            <div
                              style={{
                                color: daysArraySubTitle[day] ? "red" : "black",
                              }}
                            >
                              {daysArraySubTitle[day] ??
                                day2GanzhiChar(
                                  firstDayOfMonthJDLocal + day - 1
                                )}
                            </div>
                          </div>
                        </Tooltip>
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Tabs defaultValue="calendar">
            <Tabs.List>
              <Tabs.Tab value="calendar" rightSection={<ExplainCalendar />}>
                Calendar
              </Tabs.Tab>
              <Tabs.Tab value="events" rightSection={<ExplainEvents />}>
                Events
              </Tabs.Tab>
              <Tabs.Tab value="riseSet" rightSection={<ExplainRiseSet />}>
                Rise Set
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="calendar">
              <div>
                <strong>Julian Day Number:</strong>
                <br />
                {(firstDayOfMonthJDLocal + selectedDate.day - 1).toString()}
                <br />
                <strong>Gregorian: </strong>
                <br />
                {selectedDate.toFormat("yyyy LLLL dd")}
                <br />
                <strong>Chinese:</strong>
                <br />
                {selectedDate.setLocale("zh-tw-u-ca-chinese").toLocaleString({
                  year: "2-digit",
                  month: "long",
                  day: "numeric",
                })}
                {day2GanzhiChar(firstDayOfMonthJDLocal + selectedDate.day - 1)}
                <br />
                <strong>Hebrew:</strong>
                <br />
                {selectedDate
                  .reconfigure({ locale: "zh-tw", outputCalendar: "hebrew" })
                  .toLocaleString()}
                <br />
                <strong>Islamic (astronomical):</strong>
                <br />
                {selectedDate
                  .reconfigure({ locale: "zh-tw", outputCalendar: "islamic" })
                  .toLocaleString()}{" "}
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="events">
              <div className={classes.tableSmallExplain}>
                <small>{zone.name}, Geocentric</small>
                <small>click to chart 🔽</small>
              </div>
              <EventsCalendar eventList={daysArrayEvents} zone={zone} />
            </Tabs.Panel>
            <Tabs.Panel value="riseSet">
              <small>
                {selectedDate.toFormat("DD z")} <strong>lon:</strong>{" "}
                {location.longitude.toFixed(2)} <strong>lat:</strong>{" "}
                {location.latitude.toFixed(2)}
              </small>
              {riseSet && (
                <RiseSet
                  sunRise={riseSet.day_sunrise}
                  moonRise={riseSet.day_moonrise}
                  zone={zone}
                ></RiseSet>
              )}
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </>
  );
}
function eventLookup(planet: number, eventCode: number): string | undefined {
  let type = "";
  // let description = "";
  if (planet === 1) {
    return `${planetsSymbol(planet)} ☌ ${planetsSymbol(eventCode)}`;
  } else if (planet < 4) {
    switch (eventCode) {
      case 0:
        type = "inferior conj.";
        break;
      case 200:
        type = "superior conj.";
        break;
      case 100:
        type = "greatest west.";
        break;
      case 300:
        type = "greatest east.";
        break;

      default:
        type = eventCode.toString();
    }
    return `${planetsSymbol(planet)} ${type} ${planetsSymbol(0)}`;
  } else if (planet < 100) {
    switch (eventCode) {
      case 0:
        type = "☍";
        break;
      case 200:
        type = "☌";
        break;
      case 100:
        type = "eastern quad.";
        break;
      case 300:
        type = "western quad.";
        break;
      default:
        type = eventCode.toString();
    }
    return `${planetsSymbol(planet)} ${type} ${planetsSymbol(0)}`;
  } else if (planet == 130) {
    return "Sirius helical rising";
  } else if (eventCode < 100) {
    return `${planetsSymbol(planet)} ☌ ${planetsSymbol(type)}`;
  }

  return `${planetsSymbol(planet)} ${type} ${planetsSymbol(0)}`;
}
