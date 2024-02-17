import ModalActionIcon from "../components/ModalActionIcon";
import { Anchor, Table } from "@mantine/core";
export default function Explain() {
  return (
    <ModalActionIcon modalHeading="Some Explanation">
      <div>
        <h3>Calendar</h3>
        <p>
          This calender is a <strong>Gregorian calendar</strong>, both before
          and after 1582.
        </p>
        <p>
          Other formats are converted with the help of{" "}
          <Anchor
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/unicode-org/cldr/blob/main/common/bcp47/calendar.xml"
          >
            your explorer
          </Anchor>
          , thus it might be incorrect in a longer time range.
        </p>
        <p>
          <strong>Lunisolar Calendar</strong> is a calendar tying to associate
          Moon to Sun in some way. Different locations have different Sun and
          different Moon, thus each algorithm could be applied to a particular
          location and generate a calendar variant.
        </p>
        <p>
          That's why Chinese calendar published by authorities in Beijing and
          Taiwan could be a little different. Each Tibetan temple publishes its
          own calendar. Celebrations of Indian festivals might also occur on
          different days.
        </p>
        <Table withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>Islamic</Table.Th>
              <Table.Th>Hebrew</Table.Th>
              <Table.Th>Chinese</Table.Th>
              <Table.Th>Panchang (Vedic)</Table.Th>
              <Table.Th>Tibetan (Panchang)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>convert</Table.Td>
              <Table.Td>
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://webspace.science.uu.nl/~gent0113/islam/islam_tabcal_converter.htm"
                >
                  here
                </Anchor>
              </Table.Td>
              <Table.Td>
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.jewfaq.org/jewish_calendar"
                >
                  explain
                </Anchor>
                /
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.jewfaq.org/current_jewish_calendar"
                >
                  calendar
                </Anchor>
              </Table.Td>
              <Table.Td>
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://ytliu0.github.io/ChineseCalendar/rules.html"
                >
                  explain
                </Anchor>
                /
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://ytliu0.github.io/ChineseCalendar/"
                >
                  calendar
                </Anchor>
              </Table.Td>
              <Table.Td>
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.drikpanchang.com/panchang/month-panchang.html"
                >
                  calendar
                </Anchor>
              </Table.Td>
              <Table.Td>
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://zangli.pro/"
                >
                  calendar
                </Anchor>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>type</Table.Td>
              <Table.Td>lunar</Table.Td>
              <Table.Td>lunisolar</Table.Td>
              <Table.Td>lunisolar</Table.Td>
              <Table.Td>lunisolar</Table.Td>
              <Table.Td>lunisolar</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>day start</Table.Td>
              <Table.Td>sunset</Table.Td>
              <Table.Td>sunset</Table.Td>
              <Table.Td>midnight</Table.Td>
              <Table.Td>
                sunrise: Sun in ASC or upper limb of the solar disk is seen
              </Table.Td>
              <Table.Td>
                sunrise: could see the thread in hand clearly.
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>month start</Table.Td>
              <Table.Td>crescent moon</Table.Td>
              <Table.Td>new moon</Table.Td>
              <Table.Td>new moon</Table.Td>
              <Table.Td>next day of (new moon or full moon)</Table.Td>
              <Table.Td>next day of new moon</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>year start</Table.Td>
              <Table.Td>first month of a 12 month loop</Table.Td>
              <Table.Td>first month after spring equinox</Table.Td>
              <Table.Td>the month contains ecliptic longitude 330°</Table.Td>
              <Table.Td>the month contains sidereal Aries cusp</Table.Td>
              <Table.Td>
                the month contains ecliptic longitude 330° with simplified
                calculation (平气)
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>leap month</Table.Td>
              <Table.Td>never</Table.Td>
              <Table.Td>last month of a year</Table.Td>
              <Table.Td>
                the month does not contains (中气) ecliptic longitude (15 + 30m,
                m is an integer) degree
              </Table.Td>
              <Table.Td>the month does not contains sign cusps</Table.Td>
              <Table.Td>
                same as Chinese but with simplified calculation (平气)
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>other</Table.Td>
              <Table.Td>
                crescent moon visible varies by different definitions and
                observers.
              </Table.Td>
              <Table.Td>
                Start of month might be influenced by festival's weekday.
              </Table.Td>
              <Table.Td>
                A day contains the 中气, even if the time of 中气 occurred after
                new moon, which produce a lot of mess.
              </Table.Td>
              <Table.Td>
                <li>lunar day (tithi) is lunar phase of 12°</li>
                <li>
                  solar day's name is following lunar day at sunrise, which
                  generated repeated or loss of day
                </li>
                <li>Sign cusps is also of sidereal ecliptic longitude.</li>
              </Table.Td>
              <Table.Td>
                Days skipped or repeated following the rule of Panchang.
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </ModalActionIcon>
  );
}
