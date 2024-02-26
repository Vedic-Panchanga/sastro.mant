import { Table } from "@mantine/core";
import { FixedOffsetZone } from "luxon";
import { jdut2DateTime, planetsSymbol } from "../utils";
import sunriseAscDec from "../assets/sunrise-ascdec.svg";
import sunriseAstronomy from "../assets/sunrise-astronomy.svg";
import classes from "./RiseSet.module.css";
interface Event {
  type: string;
  rise: number;
  set: number;
}
function formatDayTime(jdut: number, zone: FixedOffsetZone) {
  return jdut2DateTime(jdut, zone).toFormat("HH:mm:ss");
}
function EventRow({ event, zone }: { event: Event; zone: FixedOffsetZone }) {
  let color: string | null = "#003262";
  let pic: string | null = null;
  if (event.type.includes("Naut")) {
    color = "#4997D0";
  } else if (event.type.includes("Civil")) {
    color = "#8AB9F1";
  } else if (event.type.includes("Rise")) {
    color = null;
    pic = sunriseAstronomy;
  } else if (event.type.includes("Asc")) {
    color = null;
    pic = sunriseAscDec;
  }
  return (
    <Table.Tr>
      <Table.Th className="text-start">
        {color ? (
          <span
            className={classes["color-display"]}
            style={{ backgroundColor: color }}
          ></span>
        ) : (
          <img
            src={pic ?? sunriseAscDec}
            alt="sunrise"
            className={classes.icon}
          />
        )}
        {event.type}
      </Table.Th>
      <Table.Td className="text-center">
        {formatDayTime(event.rise, zone)}
      </Table.Td>
      <Table.Td className="text-center">
        {formatDayTime(event.set, zone)}
      </Table.Td>
    </Table.Tr>
  );
}
export default function RiseSet({
  sunRise,
  moonRise,
  zone,
}: {
  sunRise: number[];
  moonRise: number[];
  zone: FixedOffsetZone;
}) {
  function formatDayTime(jdut: number) {
    return jdut2DateTime(jdut, zone).toFormat("HH:mm:ss");
  }
  return (
    <Table>
      <Table.Thead>
        {/* <Table.Tr> */}
        <Table.Th className={classes.tableHead}>
          {planetsSymbol(0)} Sun {planetsSymbol(0)}
        </Table.Th>
        <Table.Th>Rise</Table.Th>
        <Table.Th>Set</Table.Th>
        {/* </Table.Tr> */}
      </Table.Thead>
      <Table.Tbody>
        <EventRow
          event={{
            type: "Astronomy Twilight",
            rise: sunRise[1],
            set: sunRise[2],
          }}
          zone={zone}
        />
        <EventRow
          event={{
            type: "Nautical Twilight",
            rise: sunRise[3],
            set: sunRise[4],
          }}
          zone={zone}
        />
        <EventRow
          event={{
            type: "Civil Twilight",
            rise: sunRise[5],
            set: sunRise[6],
          }}
          zone={zone}
        />
        <EventRow
          event={{
            type: "Rise/Set",
            rise: sunRise[7],
            set: sunRise[8],
          }}
          zone={zone}
        />
        <EventRow
          event={{
            type: "Sun conj. Asc/Dec",
            rise: sunRise[9],
            set: sunRise[10],
          }}
          zone={zone}
        />
        <Table.Tr>
          <Table.Th>Mid Heaven</Table.Th>
          <Table.Td colSpan={2} className="text-center">
            {formatDayTime(sunRise[0])}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
      <Table.Thead>
        <Table.Th className={classes.tableHead}>
          {planetsSymbol(1)} Moon {planetsSymbol(1)}
        </Table.Th>
        <Table.Th>Rise</Table.Th>
        <Table.Th>Set</Table.Th>
      </Table.Thead>
      <Table.Tbody>
        <EventRow
          event={{
            type: "Rise/Set",
            rise: moonRise[1],
            set: moonRise[2],
          }}
          zone={zone}
        />
        <Table.Tr>
          <Table.Th>Mid Heaven</Table.Th>
          <Table.Td colSpan={2} className="text-center">
            {formatDayTime(moonRise[0])}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
