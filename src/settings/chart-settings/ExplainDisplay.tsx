import { Anchor } from "@mantine/core";
import ModalActionIcon from "../../components/ModalActionIcon";

export default function ExplainDisplay() {
  return (
    <ModalActionIcon modalHeading="About Node and Lilith">
      Here is my explanation:
      <h4> Different Black Moon Lilith (apogee):</h4>
      <p>
        <li>
          <strong>The Mean Lilith</strong> moves evenly.
        </li>
        <li>
          <strong>The Interpolated Lilith</strong> moves back and forth, its
          position reveals
          <strong> the gravity field</strong> introduced by Earth and Sun, and
          almost aligns with the Moon's apparent apogee.
        </li>
        <li>
          <strong>The Osculated (true) Lilith</strong> moves back and forth
          dramatically, often deviating by up to 30 degrees from the mean one.
          Its degree to Moon reveals the
          <strong> instantaneous kinetic energy</strong> of the Moon. It aligns
          with the Moon exactly when it reaches the apparent apogee.
        </li>
        <li>
          Great to read:{" "}
          <Anchor
            target="_blank"
            rel="noopener noreferrer"
            href="https://groups.io/g/swisseph/topic/the_moon_s_apogee_black_moon/99823212?p=,,,20,0,0,0::recentpostdate/sticky,,,20,0,0,99823212,previd%3D1708981979224931176,nextid%3D1706040482463255063&previd=1708981979224931176&nextid=1706040482463255063"
          >
            Discussions on Lilith.
          </Anchor>{" "}
          I also participated in the discussion and provided some pictures to
          demonstrate how all three Liliths make a lot of sense there (at the
          very end of this discussion).
        </li>
      </p>
      <h4>Different Node:</h4>
      <p>
        Mean node and true node are usually close to each other. The{" "}
        <strong>mean node </strong>is the traditional one, it moves evenly,
        while the <strong>true node</strong> moves back and forth, and aligns
        with the Moon exactly when the Moon reaches the 0 degree in latitude.{" "}
        <Anchor
          target="_blank"
          rel="noopener noreferrer"
          href="https://groups.io/g/swisseph/topic/87879016?p=%2C%2C%2C20%2C0%2C0%2C0%3A%3Arecentpostdate%2Fsticky%2C%2Cmean+node%2C20%2C2%2C0%2C87879016%2Cct%253D1&ct=1"
        >
          Discussions on Node.
        </Anchor>
      </p>
    </ModalActionIcon>
  );
}
