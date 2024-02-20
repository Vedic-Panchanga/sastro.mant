import { parseDegree, zodiacSymbol } from "../utils";

export default function LongitudeFormat({ longitude }: { longitude: number }) {
  const formatDegree = parseDegree(longitude);
  const zodiacString = zodiacSymbol(formatDegree.zodiac);
  //   const zodiacColor = colorTheme(formatDegree.zodiac % 4);
  return (
    <>
      <span>{formatDegree.degree}</span>
      <span className={`color-${formatDegree.zodiac % 4} astro-font hero`}>
        {zodiacString}
      </span>
      <span>{formatDegree.minute}</span>
    </>
  );
}
