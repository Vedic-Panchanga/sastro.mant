import { parseDegree, zodiacSymbol } from "../utils";

export default function LongitudeFormat({ longitude }: { longitude: number }) {
  const formatDegree = parseDegree(longitude);
  const zodiacString = zodiacSymbol(formatDegree.zodiac);
  //   const zodiacColor = colorTheme(formatDegree.zodiac % 4);
  return (
    <div className="text-center">
      <span>{formatDegree.degree}</span>
      <span className={`color-${formatDegree.zodiac % 4}`}>{zodiacString}</span>
      <span>{formatDegree.minute}</span>
    </div>
  );
}
