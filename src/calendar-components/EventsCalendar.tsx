import { Table } from "@mantine/core";
import { type EventType } from "./CalendarTable";
import { FixedOffsetZone } from "luxon";
import { jdut2DateTime } from "../utils";
import LongitudeFormat from "../components/LongitudeFormat";
export default function EventsCalendar({
  eventList,
  zone,
}: {
  eventList: EventType[][];
  zone: FixedOffsetZone;
}) {
  console.log(eventList);
  const rows = eventList.map((eventListOjb) =>
    eventListOjb.map((eventOjb, index) => (
      <Table.Tr key={`${eventOjb.jd} ${index}`}>
        <Table.Td>
          {jdut2DateTime(eventOjb.jd, zone).toFormat("yyyy LLL dd HH:mm:ss")}
        </Table.Td>
        <Table.Td>{eventOjb.type}</Table.Td>
        <Table.Td>
          <LongitudeFormat longitude={Number(eventOjb.value)} />
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
