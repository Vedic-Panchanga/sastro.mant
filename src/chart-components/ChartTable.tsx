import { ScrollArea, Table, Tabs, Tooltip } from "@mantine/core";
import { type Planet as PlanetType, Fixstars } from "./Chart.tsx";
import { planetsSymbol, ifDegreeInOrb, fixedStarName } from "../utils.ts";
import Settings from "../settings/Settings.tsx";
import classes from "./ChartTable.module.css";
import LongitudeFormat from "../components/LongitudeFormat.tsx";

type TableChartProps = {
  planetState: Record<string, PlanetType>;
};

function TableChart({ planetState }: TableChartProps) {
  return (
    <ScrollArea
      h="80vh"
      // miw={500}
      // onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      {/* <Table.ScrollContainer minWidth={500}> */}
      <Table highlightOnHover stickyHeader>
        <Table.Thead
        // className={cx(classes.header, { [classes.scrolled]: scrolled })}
        >
          <Table.Tr>
            <Table.Th>Planet</Table.Th>
            <Table.Th>Lon</Table.Th>
            <Table.Th>Lat</Table.Th>
            <Table.Th>
              <Tooltip label="degree/day, speed in longitude">
                <div>speed (lon)</div>
              </Tooltip>
            </Table.Th>
            <Table.Th>
              <Tooltip label="in AU, from center of Earth or Sun">
                <div>distance</div>
              </Tooltip>
            </Table.Th>
            <Table.Th>
              <Tooltip
                label={
                  <>
                    1/1000 degree/day, speed in latitude,
                    <br />
                    positive is north (ecliptic)
                  </>
                }
              >
                <div>speed (lat)</div>
              </Tooltip>
            </Table.Th>
            <Table.Th>
              <Tooltip
                label={
                  <>
                    1/1000 degree/day, speed in distance,
                    <br /> positive is flying away from center
                  </>
                }
              >
                <div>speed (dist)</div>
              </Tooltip>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(planetState).map(([planetIndex, planetInfo]) => {
            if (!planetInfo.shown) {
              return;
            }

            return (
              <Table.Tr key={planetIndex}>
                <Table.Td>{planetsSymbol(planetIndex)}</Table.Td>
                <Table.Td>
                  <LongitudeFormat longitude={planetInfo.lon} />
                </Table.Td>
                <Table.Td>{planetInfo.lat?.toFixed(3)}</Table.Td>
                <Table.Td>{planetInfo.speed?.toFixed(3)}</Table.Td>
                <Table.Td>{planetInfo.distance?.toExponential(4)}</Table.Td>
                <Table.Td>
                  {planetInfo.speed_lat
                    ? (planetInfo.speed_lat * 1000).toFixed(3)
                    : ""}
                </Table.Td>
                <Table.Td>
                  {planetInfo.speed_distance
                    ? (planetInfo.speed_distance * 1000).toExponential(4)
                    : ""}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      {/* </Table.ScrollContainer> */}
    </ScrollArea>
  );
}
type TableFixstarProps = {
  planetState: Record<string, PlanetType>;
  fixstar: Fixstars;
};
type FixstarAcc = {
  [starIndex: string]: {
    key: string;
    lon: number;
    lat: number;
    name: string;
    planet: number[];
  };
};
function TableFixstar({ planetState, fixstar }: TableFixstarProps) {
  const fixstarInOrb = Object.entries(fixstar).reduce<FixstarAcc>(
    (acc, [starIndex, starInfo]) => {
      function pushPlanet(planetIndex: number, planetLon: number) {
        if (ifDegreeInOrb(planetLon, starInfo.lon, 1.5)) {
          if (!acc[starIndex]) {
            // console.log("fix", starIndex, starInfo);

            acc[starIndex] = {
              key: starIndex,
              lon: starInfo.lon,
              lat: starInfo.lat,
              name: starInfo.name,
              planet: [],
            };
          }
          acc[starIndex].planet.push(planetIndex);
        }
      }
      Object.entries(planetState).forEach(([planetIndex, planetInfo]) => {
        // only 9 planets and axies are considered
        const numberPlanetIndex = Number(planetIndex);
        if (
          (numberPlanetIndex >= 0 && numberPlanetIndex <= 9) ||
          numberPlanetIndex == -4 || //asc
          numberPlanetIndex == -6 //mc
        ) {
          pushPlanet(Number(numberPlanetIndex), planetInfo.lon);
        }
      });
      return acc;
    },
    {}
  );
  const sortedFixstar = Object.values(fixstarInOrb).sort(
    (a, b) => a.lon - b.lon
  );
  // console.log("fixstar", fixstar);

  return (
    <Table.ScrollContainer minWidth={500}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Fixstar</Table.Th>
            <Table.Th>Lon</Table.Th>
            <Table.Th>Lat</Table.Th>
            <Table.Th>
              <Tooltip label="planets close to the fixed stars, positive means planets' lon > fixed stars' lon">
                <div>Planets</div>
              </Tooltip>
            </Table.Th>
            <Table.Th>Name</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedFixstar.map((fixstarInfo) => {
            // Find the index of the first comma
            const indexOfComma = fixstarInfo.name.indexOf(",");
            return (
              <Table.Tr key={fixstarInfo.key}>
                <Table.Td>
                  {indexOfComma !== 0
                    ? fixstarInfo.name.substring(0, indexOfComma)
                    : fixstarInfo.name.substring(1)}
                </Table.Td>
                <Table.Td>
                  <LongitudeFormat longitude={fixstarInfo.lon} />
                </Table.Td>
                <Table.Td>{fixstarInfo.lat?.toFixed(3)}</Table.Td>
                <Table.Td>
                  {fixstarInfo.planet.map((planetIndex) => (
                    <div key={planetIndex}>
                      {planetsSymbol(planetIndex)}{" "}
                      {(planetState[planetIndex].lon - fixstarInfo.lon).toFixed(
                        2
                      )}
                      {"°"}{" "}
                    </div>
                  ))}
                </Table.Td>
                <Table.Td>{fixedStarName(fixstarInfo.key)}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
type TabChartProps = {
  planetState: Record<string, PlanetType>;
  fixstar: Fixstars;
};

export default function ChartTable({ planetState, fixstar }: TabChartProps) {
  return (
    <Tabs defaultValue="planets" className={classes.container}>
      <Tabs.List>
        <Tabs.Tab value="planets">Planets</Tabs.Tab>
        <Tabs.Tab value="fixed">
          <Tooltip label="Only fixed stars near the planets would be displayed.">
            <div>Fixed Star</div>
          </Tooltip>
        </Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="planets">
        <TableChart planetState={planetState} />
      </Tabs.Panel>
      <Tabs.Panel value="fixed">
        <TableFixstar planetState={planetState} fixstar={fixstar} />
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Settings />
      </Tabs.Panel>
    </Tabs>
  );
}
