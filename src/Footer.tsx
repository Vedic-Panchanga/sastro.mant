import { Anchor } from "@mantine/core";
import ModalText from "./components/ModalText";

export default function Footer() {
  return (
    <ModalText text={"About this page"} modalHeading={"About this page"}>
      <p>
        This is a website provided some astrology tools, just for fun:).
        Astrological calculations are based on the{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.astro.com/swisseph/swephinfo_e.htm"
        >
          Swiss Ephemeris
        </Anchor>
        , with a bridge provided by{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/u-blusky/sweph-wasm"
        >
          u-blusky
        </Anchor>{" "}
        using WebAssembly. City search functionality is provided by{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://locationiq.com/"
        >
          LocationIQ
        </Anchor>
        .
      </p>
      <p>
        The time range is from -4800 to 3000 in the Gregorian Calendar, and the
        time zone uses fixed time offsets (so you need to pay attention to
        daylight saving time and convert to Gregorian calendar if the Julian
        calendar is used).
      </p>
      <p>
        The Swiss Ephemeris claims accuracy to the arc millisecond compared to
        the data published by NASA's JPL.
      </p>
      <p>
        Since this app treat alls times as UT1, it should have less than 1
        second difference from UTC. All times and degrees are rounded down.
      </p>
      <strong>
        Be sure to set locations and use the appropriate time zone offsets!
      </strong>
      <p>
        If anything weird happened, email me: yingch_69@proton,me. Good luck:)
      </p>
    </ModalText>
  );
}
