import { Table, UnstyledButton } from "@mantine/core";
import { type EventType } from "./CalendarTable";
import { FixedOffsetZone } from "luxon";
import { jdut2DateTime, jdut2timestamp } from "../utils";
import LongitudeFormat from "../components/LongitudeFormat";
import classes from "./EventsCalendar.module.css";
import { Link } from "react-router-dom";
export default function EventsCalendar({
  eventList,
  zone,
}: {
  eventList: EventType[][];
  zone: FixedOffsetZone;
}) {
  // console.log(eventList);
  const rows = eventList.map((eventListOjb) =>
    eventListOjb.map((eventOjb, index) => (
      <Table.Tr key={`${eventOjb.jd} ${index}`}>
        <Table.Td>
          {jdut2DateTime(eventOjb.jd, zone).toFormat("yyyy LLL dd HH:mm:ss")}
        </Table.Td>
        <Table.Td>{eventOjb.type}</Table.Td>
        <Table.Td className={classes.buttonTd}>
          <UnstyledButton
            className={classes.buttonChart}
            to={`/chart?ts=${jdut2timestamp(eventOjb.jd)}`}
            component={Link}
          >
            {eventOjb.type !== "Sirius helical rising" && (
              <LongitudeFormat longitude={Number(eventOjb.value)} />
            )}
          </UnstyledButton>
        </Table.Td>
      </Table.Tr>
    ))
  );
  return (
    <Table>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
