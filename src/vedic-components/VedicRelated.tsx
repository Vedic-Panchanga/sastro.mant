import {
  Center,
  Group,
  Table,
  Tabs,
  UnstyledButton,
  Text,
  rem,
  ScrollArea,
} from "@mantine/core";
// import { parseDegree, zodiacSymbol, colorTheme } from "../utils.js";
import { useEffect, useState } from "react";
import { Planet } from "../routes/Vedic.js";
import { DateTimeT } from "../routes/Root.js";
import { IconSelector, IconChevronDown } from "@tabler/icons-react";
import classes from "./VedicRelated.module.css";
import LongitudeFormat from "../components/LongitudeFormat.js";
export function SignText({
  firstHouseSign,
  size,
}: {
  firstHouseSign: number;
  size: number;
}) {
  const fontSizeSign = "65%";
  const distanceKendra = "3%";
  const distanceNotKendra1 = size / 4 + "%";
  const distanceNotKendra2 = "27%";
  return (
    <g fontSize={fontSizeSign} textAnchor="middle" dominantBaseline="middle">
      {/* Kendra */}
      <text x="0" y={distanceKendra}>
        {((firstHouseSign + 6) % 12) + 1}
      </text>
      <text x={"-" + distanceKendra} y="0">
        {((firstHouseSign + 3) % 12) + 1}
      </text>
      <text x="0" y={"-" + distanceKendra}>
        {firstHouseSign + 1}
      </text>
      <text x={distanceKendra} y="0">
        {((firstHouseSign + 9) % 12) + 1}
      </text>
      {/* Other */}
      <text x={distanceNotKendra1} y={distanceNotKendra2}>
        {((firstHouseSign + 7) % 12) + 1}
      </text>
      <text x={distanceNotKendra2} y={distanceNotKendra1}>
        {((firstHouseSign + 8) % 12) + 1}
      </text>
      <text x={distanceNotKendra2} y={"-" + distanceNotKendra1}>
        {((firstHouseSign + 10) % 12) + 1}
      </text>
      <text x={distanceNotKendra1} y={"-" + distanceNotKendra2}>
        {((firstHouseSign + 11) % 12) + 1}
      </text>
      <text x={"-" + distanceNotKendra1} y={"-" + distanceNotKendra2}>
        {((firstHouseSign + 1) % 12) + 1}
      </text>
      <text x={"-" + distanceNotKendra2} y={"-" + distanceNotKendra1}>
        {((firstHouseSign + 2) % 12) + 1}
      </text>
      <text x={"-" + distanceNotKendra2} y={distanceNotKendra1}>
        {((firstHouseSign + 4) % 12) + 1}
      </text>
      <text x={"-" + distanceNotKendra1} y={distanceNotKendra2}>
        {((firstHouseSign + 8) % 12) + 1}
      </text>
    </g>
  );
}
type GroupPlanets = string[];
export function PlanetKendraHouse({
  groupPlanets,
  size,
  house,
}: {
  groupPlanets: GroupPlanets;
  size: number;
  house: 0 | 3 | 6 | 9;
}) {
  if (groupPlanets.length === 0) {
    return <></>;
  }

  const anchor = {
    0: { x: 0, y: -size / 4 },
    3: { x: -size / 4, y: 0 },
    6: { x: 0, y: size / 4 },
    9: { x: size / 4, y: 0 },
  };

  if (groupPlanets.length <= 3) {
    return (
      <text x={anchor[house].x + "%"} y={anchor[house].y + "%"}>
        {groupPlanets.join(" ")}
      </text>
    );
  } else if (groupPlanets.length == 4) {
    return (
      <text x={anchor[house].x + "%"} y={anchor[house].y + "%"}>
        <tspan dy="-0.5em">{groupPlanets.slice(0, 2).join(" ")}</tspan>
        <tspan x={anchor[house].x + "%"} dy="1em">
          {groupPlanets.slice(2).join(" ")}
        </tspan>
      </text>
    );
  } else if (groupPlanets.length == 5) {
    return (
      <text x={anchor[house].x + "%"} y={anchor[house].y + "%"}>
        <tspan dy="-1em">{groupPlanets[0]}</tspan>
        <tspan x={anchor[house].x + "%"} dy="1em">
          {groupPlanets.slice(1, 4).join(" ")}
        </tspan>
        <tspan x={anchor[house].x + "%"} dy="1em">
          {groupPlanets[4]}
        </tspan>
      </text>
    );
  } else {
    const thirdMiddle = Math.ceil(groupPlanets.length / 3);
    const thirdFirst = Math.floor(groupPlanets.length / 3);
    // const thirdLast = groupPlanets.length-thirdMiddle-thirdFirst
    return (
      <text x={anchor[house].x + "%"} y={anchor[house].y + "%"}>
        <tspan dy="-1em">{groupPlanets.slice(0, thirdFirst).join(" ")}</tspan>
        <tspan x={anchor[house].x + "%"} dy="1em">
          {groupPlanets.slice(thirdFirst, thirdFirst + thirdMiddle).join(" ")}
        </tspan>
        <tspan x={anchor[house].x + "%"} dy="1em">
          {groupPlanets.slice(thirdMiddle + thirdFirst).join(" ")}
        </tspan>
      </text>
    );
  }
}
export function PlanetTopBottomHouse({
  groupPlanets,
  size,
  house,
}: {
  groupPlanets: GroupPlanets;
  size: number;
  house: 1 | 5 | 7 | 11;
}) {
  if (groupPlanets.length === 0) {
    return <></>;
  }
  const basePos = 0.46;
  const anchor = {
    1: { x: -size / 4, y: -size * basePos },
    5: { x: -size / 4, y: size * basePos },
    7: { x: size / 4, y: size * basePos },
    11: { x: size / 4, y: -size * basePos },
  };
  const direction = house === 1 || house === 11 ? "" : "-";
  if (groupPlanets.length <= 5) {
    return (
      <text x={anchor[house].x + "%"} y={anchor[house].y + "%"}>
        {groupPlanets.slice(0, 3).join(" ")}
        {groupPlanets.length > 3 && (
          <tspan x={anchor[house].x + "%"} dy={direction + "1em"}>
            {groupPlanets.slice(3).join(" ")}
          </tspan>
        )}
      </text>
    );
  } else {
    return (
      <text x={anchor[house].x + "%"} y={anchor[house].y + "%"}>
        <tspan>{groupPlanets.slice(0, 4).join(" ")}</tspan>
        {groupPlanets.length > 4 && (
          <tspan x={anchor[house].x + "%"} dy={direction + "1em"}>
            {groupPlanets.slice(4, 6).join(" ")}
          </tspan>
        )}
        {groupPlanets.length > 6 && (
          <tspan x={anchor[house].x + "%"} dy={direction + "1em"}>
            {groupPlanets.slice(6).join(" ")}
          </tspan>
        )}
      </text>
    );
  }
}
export function PlanetSideHouse({
  groupPlanets,
  size,
  house,
}: {
  groupPlanets: GroupPlanets;
  size: number;
  house: 2 | 4 | 8 | 10;
}) {
  if (groupPlanets.length === 0) {
    return <></>;
  }
  const basePos = 0.5;
  const anchor = {
    2: { x: -size * basePos, y: -size / 4 },
    4: { x: -size * basePos, y: size / 4 },
    8: { x: size * basePos, y: size / 4 },
    10: { x: size * basePos, y: -size / 4 },
  };
  const textAnchor = house === 2 || house === 4 ? "start" : "end";
  if (groupPlanets.length < 8) {
    return (
      <text
        x={anchor[house].x + "%"}
        y={anchor[house].y + "%"}
        textAnchor={textAnchor}
      >
        {groupPlanets.map((planet, index) => (
          <tspan
            key={index}
            x={anchor[house].x + "%"}
            dy={`${index === 0 ? -(groupPlanets.length - 1) / 2 : 1}em`}
          >
            {planet}
          </tspan>
        ))}
      </text>
    );
  } else {
    return (
      <text
        x={anchor[house].x + "%"}
        y={anchor[house].y + "%"}
        textAnchor={textAnchor}
      >
        {groupPlanets.slice(0, 3).map((planet, index) => (
          <tspan
            key={index}
            x={anchor[house].x + "%"}
            dy={`${index === 0 ? -(groupPlanets.length - 2) / 2 : 1}em`}
          >
            {planet}
          </tspan>
        ))}
        <tspan x={anchor[house].x + "%"} dy="1em">
          {`${groupPlanets[3]} ${groupPlanets[4]}`}
        </tspan>
        {groupPlanets.slice(5).map((planet, index) => (
          <tspan key={index} x={anchor[house].x + "%"} dy="1em">
            {planet}
          </tspan>
        ))}
      </text>
    );
  }
}
type VedicPlanetType = {
  name: string;
  lon: number;
  nakshastra: string;
  pada: number;
  index: number; //index of planet
  karaIndex: number; //index of kara
  kara: string;
};
type VedicPlanetSearchType = "lon" | "index" | "karaIndex";

interface ThProps {
  children: React.ReactNode;
  sorted: boolean;
  onSort(): void;
}
function Th({ children, sorted, onSort }: ThProps) {
  const Icon = sorted ? IconChevronDown : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={700} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
function sortData(data: VedicPlanetType[], sortBy: VedicPlanetSearchType) {
  data.sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });
  console.log("sortData", sortBy, data);
  return data;
}
function TableSort({ planetState }: { planetState: VedicPlanetType[] }) {
  const [sortedData, setSortedData] = useState(planetState);
  const [sortBy, setSortBy] = useState<VedicPlanetSearchType>("lon");
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: VedicPlanetSearchType) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(planetState, field));
  };
  const rows = sortedData.map((row) => (
    <Table.Tr key={row.name}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.kara}</Table.Td>
      <Table.Td>
        <LongitudeFormat longitude={row.lon} />
      </Table.Td>
      <Table.Td>{row.nakshastra}</Table.Td>
      <Table.Td>{row.pada}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table
        highlightOnHover
        horizontalSpacing="xs"
        verticalSpacing="xs"
        miw={320}
        // layout="fixed"
      >
        <Table.Thead>
          <Table.Tr>
            <Th sorted={sortBy === "index"} onSort={() => setSorting("index")}>
              Planet
            </Th>
            <Th
              sorted={sortBy === "karaIndex"}
              onSort={() => setSorting("karaIndex")}
            >
              Kara
            </Th>
            <Th sorted={sortBy === "lon"} onSort={() => setSorting("lon")}>
              Lon
            </Th>
            <Table.Th>Nakastra</Table.Th>
            <Table.Th>Pada</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

const nakshatras = [
  "Aswi", //1
  "Bhar",
  "Krit",
  "Rohi",
  "Mrig",
  "Ardra",
  "Puna",
  "Push",
  "Asre",
  "Magh", //2
  "PPha",
  "UPha",
  "Hast",
  "Chit",
  "Swati",
  "Visa",
  "Anu",
  "Jye",
  "Mula", //3
  "PAsha",
  "UAsha",
  "Srav",
  "Dhan",
  "Sata",
  "PBha",
  "UBha",
  "Reva",
];
const karaList = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];
// convert planetState: Record<string, Planet> => VedicPlanetType[]
function TableVedic({ planetState }: { planetState: Record<string, Planet> }) {
  function getInfo(planetIndex: string) {
    const nakshastraIndex = Math.floor(planetState[planetIndex].lon / (40 / 3));
    const padaIndex = Math.floor(planetState[planetIndex].lon / (10 / 3)) % 4;
    return {
      name: Number(planetIndex) == -4 ? "Lagna" : planetState[planetIndex].name,
      lon: planetState[planetIndex].lon,
      nakshastra: nakshatras[nakshastraIndex],
      pada: padaIndex + 1,
      index: Number(planetIndex),
      karaIndex: 64,
      kara: "",
    };
  }
  const tablePlanetsInfo = Object.keys(planetState).reduce<VedicPlanetType[]>(
    (result, planetIndex) => {
      if (planetState[planetIndex].shown !== false) {
        result.push(getInfo(planetIndex));
      }
      return result;
    },
    []
  );
  console.log("tablePlanetsInfo", tablePlanetsInfo);
  // tablePlanetsInfo[-4].name = "Lagna";
  tablePlanetsInfo.sort(
    (a, b) =>
      (b.index >= 0 && b.index < 7 ? b.lon % 30 : -1) -
      (a.index >= 0 && a.index < 7 ? a.lon % 30 : -1)
  );
  // sortTable("kara", tablePlanetsInfo);
  tablePlanetsInfo.forEach((planet, index) => {
    if (planet.index < 0 || planet.index > 7) return;
    planet.kara = karaList[index];
    planet.karaIndex = index;
  });
  return <TableSort planetState={tablePlanetsInfo} />;
}
function Dasas({
  moonPos,
  dateTime,
}: {
  moonPos: number;
  dateTime: DateTimeT;
}) {
  const vimsottariLord = [
    { lord: "Ketu", portion: 7, cumulated: 0 },
    { lord: "Venus", portion: 20, cumulated: 7 },
    { lord: "Sun", portion: 6, cumulated: 27 },
    { lord: "Moon", portion: 10, cumulated: 33 },
    { lord: "Mars", portion: 7, cumulated: 43 },
    { lord: "Rahu", portion: 18, cumulated: 50 },
    { lord: "Jupiter", portion: 16, cumulated: 68 },
    { lord: "Saturn", portion: 19, cumulated: 84 },
    { lord: "Mercury", portion: 17, cumulated: 103 },
  ];
  const startNakIndex = Math.floor((moonPos % 120) / (40 / 3));
  const portionStart = ((moonPos % 120) % (40 / 3)) * 9; //[0,120)
  const portionStartYear =
    vimsottariLord[startNakIndex].cumulated +
    (vimsottariLord[startNakIndex].portion * portionStart) / 120;
  const dataDasas = [];
  for (let i = 0; i < 9; i++) {
    const nakIndex = (startNakIndex + i) % 9;
    const temp = [];
    for (let j = 0; j < 9; j++) {
      const antardasasIndex = (nakIndex + j) % 9;
      const cumulatedAntardasas =
        (vimsottariLord[antardasasIndex].cumulated -
          vimsottariLord[nakIndex].cumulated +
          120) %
        120;
      const dasaList = {
        major: vimsottariLord[nakIndex].lord,
        minor: vimsottariLord[antardasasIndex].lord,
        cumulatedYear:
          vimsottariLord[nakIndex].cumulated +
          (cumulatedAntardasas * vimsottariLord[nakIndex].portion) / 120 -
          portionStartYear,
      };
      // if (i === 0 && cumulatedAntardasas < portionStart) {
      //   ...
      // }
      if (nakIndex < startNakIndex) {
        dasaList.cumulatedYear += 120;
      }
      temp.push(dasaList);
    }
    if (temp.length > 0) {
      dataDasas.push(temp);
    }
  }
  return (
    <Table highlightOnHover stickyHeader>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Major</Table.Th>
          <Table.Th>Minor</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Age</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {dataDasas.map((dasas) =>
          dasas.map((dasa, index) => {
            return (
              <Table.Tr
                key={dasa.cumulatedYear}
                className={index === 0 ? classes.tablePrimary : ""}
              >
                <Table.Td>{dasa.major}</Table.Td>
                <Table.Td>{dasa.minor}</Table.Td>
                <Table.Td>
                  {dateTime
                    .plus({
                      second: dasa.cumulatedYear * 365.24217 * 86400,
                    })
                    .toFormat("yyyy-MM-dd")}
                </Table.Td>
                <Table.Td>{dasa.cumulatedYear.toFixed(1)}</Table.Td>
              </Table.Tr>
            );
          })
        )}
      </Table.Tbody>
    </Table>
  );
}
export function TabVedic({
  planetState,
  dateTime,
}: {
  planetState: Record<string, Planet>;
  dateTime: DateTimeT;
}) {
  return (
    <Tabs defaultValue="planets" className={classes.tabsContainer}>
      <Tabs.List>
        <Tabs.Tab value="planets">Planets</Tabs.Tab>
        <Tabs.Tab value="dasas">Dasas</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="planets">
        <TableVedic planetState={planetState} />
      </Tabs.Panel>
      <Tabs.Panel value="dasas">
        <Dasas moonPos={planetState[1].lon} dateTime={dateTime} />
      </Tabs.Panel>
    </Tabs>
  );
}
