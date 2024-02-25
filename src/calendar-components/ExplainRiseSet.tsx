import { Anchor, List, ListItem } from "@mantine/core";
import ModalActionIcon from "../components/ModalActionIcon";

export default function ExplainRiseSet() {
  return (
    <ModalActionIcon modalHeading="What's the difference?">
      Great intro on{" "}
      <Anchor
        target="_blank"
        rel="noopener noreferrer"
        href="https://en.wikipedia.org/wiki/Twilight"
      >
        wiki
      </Anchor>
      . And here is my personal impression on them:
      <List>
        <ListItem>
          Want to watch sunrise? <strong>Sunrise</strong>
        </ListItem>
        <ListItem>
          When does Sun conjuncts with Ascendent? <strong>Sun conj. Asc</strong>{" "}
          (half of the Sun jumps over the horizon)
        </ListItem>
        <ListItem>
          Tibet sunrise: when we could see thread in hands clearly:{" "}
          <strong>Civil Twilight</strong>
        </ListItem>
        <ListItem>
          Hindu sunrise: either first sun light ray (Astronomy Sunrise), or Sun
          conj. ASC.
        </ListItem>
        <ListItem>
          What does <strong>Astronomy Twilight</strong> look like? Very dark.
          Since some stars disappear, the sky looks even darker.{" "}
        </ListItem>
        <ListItem>
          What does <strong>Nautical Twilight</strong> look like? Dark, but
          could see some light in the east.{" "}
        </ListItem>
        <ListItem>
          What does <strong>Civil Twilight</strong> look like? Bright, it looks
          like the sky in cloudy day.{" "}
        </ListItem>
      </List>
      <a
        title="Pmurph5, CC BY-SA 4.0 &lt;https://creativecommons.org/licenses/by-sa/4.0&gt;, via Wikimedia Commons"
        href="https://commons.wikimedia.org/wiki/File:Twilight-dawn_subcategories.svg"
      >
        <img
          width="512"
          alt="Twilight-dawn subcategories"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Twilight-dawn_subcategories.svg/512px-Twilight-dawn_subcategories.svg.png"
        />
      </a>
    </ModalActionIcon>
  );
}
