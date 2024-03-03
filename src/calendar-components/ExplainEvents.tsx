import { Anchor } from "@mantine/core";
import ModalActionIcon from "../components/ModalActionIcon";

export default function ExplainEvents() {
  return (
    <ModalActionIcon modalHeading="Explain on some events, ephemeris">
      <h4>Conjunction</h4>
      <p>
        The definition of conjunction means the planet and Sun share the same
        right ascension or ecliptic longitude. I use the second definition here.
      </p>
      <p>
        Conjunction time is usually very close to when the planet arrives
        closest or farthest from Earth, typically only a few days apart.
      </p>
      <p>
        While the time when the planet and Sun are closest, typically occurs
        when elongation reaches its minimum, usually only minutes apart from the
        listed conjunction time.
      </p>
      <h4>Other positions</h4>
      <p>
        Quadratures of outer planets are calculated based on when the planet
        squares to Sun in ecliptic longitude.
      </p>
      <h4>Further</h4>
      <p>
        More to read:{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://en.wikipedia.org/wiki/Conjunction_(astronomy)"
        >
          wiki page
        </Anchor>
        <br />
        Lookup printed all planets motion at{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.astro.com/swisseph/ae/"
        >
          astro.com
        </Anchor>
        <br />
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://horoscopes.astro-seek.com/monthly-astro-calendar"
        >
          Astro-seek
        </Anchor>{" "}
        with{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://horoscopes.astro-seek.com/calculate-monthly-planetary-movement"
        >
          delicates graphs
        </Anchor>
        <br />
        Or{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.timeanddate.com/astronomy/night/"
        >
          sky tools with animation
        </Anchor>{" "}
        in timeandlocation.com
      </p>
      <p>
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://stellarium.org/"
        >
          Stellarium
        </Anchor>{" "}
        is a very popular free software available on web/mobile/desktop simulate
        the sky. <br />
        Astrolog, another light-weight free astrology software, is one of the
        best. The ephemeris feature of it is very good.
      </p>
      <div>
        <a
          title="Wmheric, CC BY-SA 3.0 &lt;https://creativecommons.org/licenses/by-sa/3.0&gt;, via Wikimedia Commons"
          href="https://commons.wikimedia.org/wiki/File:Positional_astronomy.svg"
        >
          <img
            // width="600"
            alt="Positional astronomy"
            // src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Positional_astronomy.svg/256px-Positional_astronomy.svg.png"
            src="https://upload.wikimedia.org/wikipedia/commons/f/f6/Positional_astronomy.svg"
            // src="https://upload.wikimedia.org/wikipedia/commons/5/57/Positional_astronomy.png"
          />
        </a>
      </div>
    </ModalActionIcon>
  );
}
