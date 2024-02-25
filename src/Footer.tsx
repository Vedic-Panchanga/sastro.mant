import { Anchor } from "@mantine/core";
import ModalText from "./components/ModalText";

export default function Footer() {
  return (
    <ModalText text={"About this page"} modalHeading={"About this page"}>
      <p>
        This is a website provided some astrology tools, for fun:). Astrological
        calculations are based on{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.astro.com/swisseph/swephinfo_e.htm"
        >
          Swiss Ephemeris
        </Anchor>
        , and a bridge with wasm provided by{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/u-blusky/sweph-wasm"
        >
          u-blusky
        </Anchor>
        . City search is provided by{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://locationiq.com/"
        >
          LocationIQ freeAPI
        </Anchor>
        .
      </p>
      <p>
        Time range from -4800 to 3000, Gregorian, and the time zone is fixed
        time offset (which means you need to pay attention to daylight saving
        and convert to gregorian if julian calendar is using).
      </p>
      <p>
        The Swiss Ephemeris claims an accuracy to arc millisecond compared to
        JPL published by NASA.
      </p>
    </ModalText>
  );
}
