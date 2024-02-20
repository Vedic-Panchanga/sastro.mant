import {
  day2GanzhiChar,
  jdut2DateTime,
  jieqiList,
  timestamp2jdlocal,
  timestamp2jdut,
} from "../utils";

import { Table, Tabs, Tooltip } from "@mantine/core";
import { type DateTimeT } from "../routes/Root";
import classes from "./CalendarTable.module.css";
import { useEffect, useState } from "react";
import { DateTime, FixedOffsetZone } from "luxon";
import Explain from "./Explain";
import astrologer from "../astrologer";
import Events from "./Events";

// const enum calendarType {
//   Observe,
//   Astrology,
// }
export type EventType = {
  jd: number; //when
  name: number; //number, since we would like to use planets' symbols
  type?: string; //what, number, look the numbers up in the table
  value: string | number; //where. =>where does it happen or the magnitude
  display?: string; // normally: concat: "jd  name + type  value", but some use display directly, like "display  value" (display like new moon)
};
const DAYS = 7;

export default function CalendarTable({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: DateTimeT;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateTimeT>>;
}) {
  const calendarArray: (number | null)[][] = [];

  const days = selectedDate.daysInMonth;
  const daysArraySubTitle = new Array(days! + 1).fill("");
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
    firstDayOfMonth.set({ hour: 12 }).toUnixInteger(),
    firstDayOfMonth.offset
  );
  const [wasm, setWasm] = useState<Record<string, Array<number[]>>>({});
  //apply the calculation
  useEffect(() => {
    astrologer(
      timestamp2jdut(
        DateTime.fromObject(
          { year: selectedDate.year },
          { zone: FixedOffsetZone.instance(selectedDate.offset) }
        ).toUnixInteger()
      ),
      -1,
      0,
      0,
      0,
      "P",
      258,
      512
    )
      .then((wasm) => {
        setWasm(wasm);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error
      });
  }, [selectedDate.year, selectedDate.offset]);
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
    const startMonth = timestamp2jdut(firstDayOfMonth.toUnixInteger());
    //exclusive, in jdut
    const endMonth = timestamp2jdut(
      firstDayOfMonth.plus({ day: days }).toUnixInteger()
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
          display: jieqiList(Number(jieqiArray[1])),
        });
      }
    });
    wasm.month_moons?.forEach(
      (moonArray: [number, number, number] | number[]) => {
        if (moonArray[0] >= endMonth || moonArray[0] < startMonth) {
          return;
        } else {
          const moonDateTime = jdut2DateTime(moonArray[0], zone);
          daysArraySubTitle[moonDateTime.day] =
            moonArray[1] == 0 ? "新月" : "满月";
          daysArrayEvents[moonDateTime.day].push({
            name: 1, //number of MOON
            jd: moonArray[0],
            value: moonArray[2],
            display: moonArray[1] == 0 ? "新月" : "满月",
          });
        }
      }
    );
  }

  //calendar skelton
  let day = 1;
  for (let i = 0; i < 5; i++) {
    if (i == 0 && days === 28 && firstDayOfMonth.weekday == 1) {
      continue;
    }
    const week: (number | null)[] = [];
    for (let j = 0; j < DAYS; j++) {
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

  return (
    <div>
      {wasm && (
        <>
          <Table
            style={{ textAlign: "center", maxWidth: "600px" }}
            captionSide="top"
          >
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
                    return (
                      <Table.Td key={day + "-" + index + "-" + i}>
                        <Tooltip
                          events={{ hover: true, focus: false, touch: false }}
                          label={
                            <>
                              <div>
                                {dayStringParts[1].value}
                                {dayStringParts[3].value}
                                {dayStringParts[4].value}
                              </div>
                              <div>
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
              <Tabs.Tab value="calendar">calendar</Tabs.Tab>
              <Tabs.Tab value="events">events</Tabs.Tab>
              <Tabs.Tab value="settings">Settings</Tabs.Tab>
              <div style={{ marginLeft: "auto", alignSelf: "center" }}>
                <Explain />
              </div>
            </Tabs.List>

            <Tabs.Panel value="calendar">
              <div>
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
              <small>{zone.name}</small>
              <Events eventList={daysArrayEvents} zone={zone} />
            </Tabs.Panel>
            <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
          </Tabs>
        </>
      )}
    </div>
  );
}
