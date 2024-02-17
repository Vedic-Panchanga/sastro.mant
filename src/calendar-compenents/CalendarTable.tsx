import {
  day2GanzhiChar,
  jdut2DateTime,
  jieqiList,
  timestamp2jdlocal,
  timestamp2jdut,
} from "../utils";

import { Table, Tooltip } from "@mantine/core";
import { type DateTimeT } from "../routes/Root";
import classes from "./CalendarTable.module.css";
import { useMemo } from "react";
import { FixedOffsetZone } from "luxon";
const enum calendarType {
  Observe,
  Astrology,
}
type event = {
  name: string;
  jd: number;
  value: string | number; //where does it happen or the magnitude
  type?: calendarType;
};
const DAYS = 7;
type Day = {
  dayNum: number;
  subTitle: string;
  jd: number;
  eventList?: event[];
};

export default function CalendarTable({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: DateTimeT;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateTimeT>>;
}) {
  const calendarArray: (Day | null)[][] = [];
  const zone = FixedOffsetZone.instance(selectedDate.offset);
  const days = selectedDate.daysInMonth;
  //record jieqi+moon
  const daysArray = new Array(days);
  const firstDayofYear = selectedDate.set({
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const firstDayofMonth = selectedDate.set({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  //inclisive
  const startMonth = timestamp2jdut(firstDayofMonth.toUnixInteger());
  //exlusive
  const endMonth = timestamp2jdut(
    selectedDate
      .set({
        month: selectedDate.month + 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toUnixInteger()
  );
  const wasm = useMemo(
    () =>
      JSON.parse(
        window.Module.ccall(
          "get",
          "string",
          [
            "number",
            "number",
            "number",
            "number",
            "number",
            "string",
            "number",
            "number",
          ],
          [
            timestamp2jdut(firstDayofYear.toUnixInteger()),
            -1,
            0,
            0,
            0,
            "P",
            258,
            512,
          ]
        )
      ),
    [firstDayofYear]
  );
  console.log("wasmCalendarMonth", wasm);
  // console.log("wasmCalendarMonth", wasmRaw);
  // const wasm = JSON.parse(wasmRaw);

  wasm.month_jieqi.forEach((jieqiArray: [number, number]) => {
    if (jieqiArray[0] >= endMonth || jieqiArray[0] < startMonth) {
      return;
    } else {
      const jieqiDateTime = jdut2DateTime(jieqiArray[0], zone);
      daysArray[jieqiDateTime.day] = jieqiList(Number(jieqiArray[1]));
    }
  });
  wasm.month_moons.forEach((moonArray: [number, number, number]) => {
    if (moonArray[0] >= endMonth || moonArray[0] < startMonth) {
      return;
    } else {
      const moonDateTime = jdut2DateTime(moonArray[0], zone);
      daysArray[moonDateTime.day] = moonArray[1] == 0 ? "新月" : "满月";
    }
  });

  let day = 1;
  for (let i = 0; i < 5; i++) {
    if (i == 0 && days === 28 && firstDayofMonth.weekday == 1) {
      continue;
    }
    const week: (Day | null)[] = [];
    for (let j = 0; j < DAYS; j++) {
      const dayCanlendar = selectedDate.set({
        day: day,
      });
      const jd =
        timestamp2jdlocal(dayCanlendar.toUnixInteger(), dayCanlendar.offset) +
        0.5;
      if ((i === 0 && j < firstDayofMonth.weekday) || day > days!) {
        week.push(null);
      } else {
        week.push({
          dayNum: day,
          subTitle: daysArray[day] ?? day2GanzhiChar(jd),
          jd: jd,
        });
        day++;
      }
    }
    calendarArray.push(week);
    if (day > days!) break;
  }

  // const firstDay = wasm.month_jieqi[0].day;
  return (
    <div>
      <Table
        style={{ textAlign: "center", maxWidth: "600px" }}
        captionSide="top"
      >
        {/* <Table.Caption>
          {selectedDate
            .setLocale("zh-tw-u-ca-chinese")
            .toLocaleString({ year: "2-digit", month: "long" })}
        </Table.Caption> */}
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
                    <Table.Td key={day + "-" + index + "-" + i}></Table.Td>
                  );
                }
                const dayCanlendar = selectedDate.set({
                  day: day.dayNum,
                });
                const dayStringParts = dayCanlendar
                  .setLocale("zh-tw-u-ca-chinese")
                  .toLocaleParts({
                    dateStyle: "long",
                  });
                // const jd =
                //   timestamp2jdlocal(
                //     dayCanlendar.toUnixInteger(),
                //     dayCanlendar.offset
                //   ) + 0.5;

                return (
                  <Table.Td key={day.dayNum + "-" + index + "-" + i}>
                    <Tooltip
                      events={{ hover: true, focus: false, touch: false }}
                      label={
                        <>
                          <div>
                            {dayStringParts[1].value}
                            {dayStringParts[3].value}
                            {dayStringParts[4].value}
                          </div>
                          <div>{day.jd.toString()}</div>
                        </>
                      }
                    >
                      <div
                        className={
                          selectedDate.day === day.dayNum
                            ? classes.selected
                            : ""
                        }
                        onClick={() => {
                          setSelectedDate(dayCanlendar);
                        }}
                      >
                        {day.dayNum.toString()}
                        <br />
                        {day.subTitle}
                      </div>
                    </Tooltip>
                  </Table.Td>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <div>
        {selectedDate.toFormat("yyyy LLLL dd")}
        <br />
        {selectedDate
          .setLocale("zh-tw-u-ca-chinese")
          .toLocaleString({ year: "2-digit", month: "long", day: "numeric" })}
        <br />
        {selectedDate
          .reconfigure({ locale: "zh-cn", outputCalendar: "hebrew" })
          .toLocaleString()}{" "}
        <br />
        {selectedDate
          .reconfigure({ locale: "zh-cn", outputCalendar: "islamic" })
          .toLocaleString()}
        <br />
        {selectedDate
          .reconfigure({ locale: "zh-cn", outputCalendar: "islamicc" })
          .toLocaleString()}{" "}
      </div>
    </div>
  );
}
