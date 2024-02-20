import { Table } from "@mantine/core";
import { type EventType } from "./CalendarTable";
import { FixedOffsetZone } from "luxon";
import { jdut2DateTime } from "../utils";
import LongitudeFormat from "../components/LongitudeFormat";
export default function Events({
  eventList,
  zone,
}: {
  eventList: EventType[][];
  zone: FixedOffsetZone;
}) {
  //   console.log(eventList);

  return (
    <Table>
      {eventList.map((eventListOjb) =>
        eventListOjb.map((eventOjb) => (
          <Table.Tr>
            <Table.Td>
              {jdut2DateTime(eventOjb.jd, zone).toFormat(
                "yyyy LLL dd HH:mm:ss"
              )}
            </Table.Td>
            <Table.Td>{eventOjb.display ?? eventOjb.type}</Table.Td>
            <Table.Td>
              <LongitudeFormat longitude={Number(eventOjb.value)} />
            </Table.Td>
          </Table.Tr>
        ))
      )}
    </Table>
  );
}
