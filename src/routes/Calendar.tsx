import { ActionIcon, NativeSelect, TextInput } from "@mantine/core";

import { useEffect, useMemo, useState } from "react";

import { useOutletContext } from "react-router-dom";
import { type DateTimeT, Location } from "./Root";
import CalendarTable from "../calendar-compenents/CalendarTable";
import { FixedOffsetZone } from "luxon";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import classes from "./Calendar.module.css";
export default function Calendar() {
  const [dateTime, , location]: [DateTimeT, never, Location] =
    useOutletContext();
  const [year, setYear] = useState<string>(dateTime.year.toString());

  const [selectedDate, setSelectedDate] = useState(
    dateTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  );

  function handleMonth(newMonth: number) {
    setSelectedDate((prev) => prev.set({ month: newMonth }));
  }
  function handleYear(newYear: string) {
    setYear(newYear);
    const validYear = Number(newYear);
    if (!isNaN(validYear)) {
      setSelectedDate((prev) => prev.set({ year: validYear }));
    }
  }
  useEffect(() => {
    setSelectedDate((prev) =>
      prev.setZone(FixedOffsetZone.instance(dateTime.offset), {
        keepLocalTime: true,
      })
    );
  }, [dateTime]);
  function handlePlusMinus(key: string, direction: number) {
    const newSelectedDate = selectedDate.plus({ [key]: direction });
    setSelectedDate(newSelectedDate);
    setYear(newSelectedDate.year.toString());
  }

  return (
    <div className={classes.container}>
      <div className={classes.stack}>
        <div className={classes.select}>
          <ActionIcon
            size="xs"
            variant="default"
            onClick={() => handlePlusMinus("year", -1)}
          >
            <IconMinus />
          </ActionIcon>
          <TextInput
            // type="number"
            placeholder="Year"
            value={year}
            onChange={(event) => handleYear(event.currentTarget.value)}
            maxLength={20}
            style={{ maxWidth: 100, display: "inline-flex" }}
          />
          <ActionIcon
            size="xs"
            variant="default"
            onClick={() => handlePlusMinus("year", 1)}
          >
            <IconPlus />
          </ActionIcon>
        </div>
        <div className={classes.select}>
          <ActionIcon
            size="xs"
            variant="default"
            onClick={() => handlePlusMinus("month", -1)}
          >
            <IconMinus />
          </ActionIcon>
          <NativeSelect
            value={selectedDate.month.toString()}
            data={[
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
            ]}
            onChange={(event) => handleMonth(Number(event.target.value))}
            style={{ maxWidth: 100, display: "inline-flex" }}
          />
          <ActionIcon
            size="xs"
            variant="default"
            onClick={() => handlePlusMinus("month", 1)}
          >
            <IconPlus />
          </ActionIcon>
        </div>
      </div>
      <CalendarTable
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}
