import { zhiList } from "../utils";
import { ganList } from "../utils";
import classes from "./BaziPillar.module.css";
export function Pillar({
  title,
  ri,
  gan,
  zhi,
  gender,
}: {
  title: string;
  ri: number;
  gan: number;
  zhi: number;
  gender?: string;
}) {
  const ganInfo = ganList(gan);
  const zhiInfo = zhiList(zhi);

  return (
    <div
      className={`${title === "时柱" ? classes.timePillar : ""} ${
        classes.pillar
      }`}
    >
      <strong>{title}</strong>
      <div style={{ color: wuXingColor(ganInfo.wuXing) }}>
        {title === "日柱" ? gender : shiShenGan(gan, ri, "long")}
      </div>
      <div className={classes.ganzhiPillar}>
        <strong style={{ color: wuXingColor(ganInfo.wuXing) }}>
          {ganInfo.char}
        </strong>

        <strong style={{ color: wuXingColor(zhiInfo.wuXing) }}>
          {zhiInfo.char}
        </strong>
      </div>
      {zhiInfo.cangGan.map((cang) => {
        const ganInfo = ganList(cang);
        return (
          <div
            key={cang}
            style={{ color: wuXingColor(ganInfo.wuXing), fontSize: "12px" }}
          >
            {ganInfo.char}·{shiShenGan(cang, ri, "long")}
          </div>
        );
      })}
    </div>
  );
}
export function SmallPillar({
  title1,
  title2,
  ri = 0,
  gan = 0,
  zhi = 0,
  selected = false,
  onClick,
  valid = true,
}: {
  title1: string;
  title2?: string;
  ri: number;
  gan: number;
  zhi: number;
  selected: boolean;
  onClick?: () => void;
  valid?: boolean;
}) {
  const ganInfo = ganList(gan);
  const zhiInfo = zhiList(zhi);
  const selectedStyle = selected === true ? classes.selectedStyle : "";

  return (
    <div
      className={`${selectedStyle} ${classes.smallPillar}`}
      onClick={onClick}
    >
      <div className={classes["bazi-title"]}>{title1}</div>
      <strong className={classes["bazi-title"]}>{title2}</strong>

      <div
        style={{
          color:
            valid === true
              ? wuXingColor(ganInfo.wuXing)
              : `rgba(${hexToRgb(wuXingColor(ganInfo.wuXing))}, 0.5)`,
        }}
      >
        <strong>{ganInfo.char}</strong>
        <span className={classes["bazi-short-shishen"]}>
          {shiShenGan(gan, ri, "short")}
        </span>
      </div>

      <div
        style={{
          color:
            valid === true
              ? wuXingColor(zhiInfo.wuXing)
              : `rgba(${hexToRgb(wuXingColor(zhiInfo.wuXing))}, 0.5)`,
        }}
      >
        <strong>{zhiInfo.char}</strong>
        <span className={classes["bazi-short-shishen"]}>
          {shiShenGan(zhiInfo.cangGan[0], ri, "short")}
        </span>
      </div>
    </div>
  );
}
function hexToRgb(hex: string) {
  // Remove the hash if it's present
  hex = hex.replace(/^#/, "");

  // Parse the hex value into separate RGB values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
}
function wuXingColor(wuXing = 0) {
  const colors = ["#00693E", "#C51E3A", "#79443B", "#EF9B0F", "#0070BB"];

  return colors[wuXing];
}
function shiShenGan(gan = 0, ri = 0, shortLong: "short" | "long" = "short") {
  //五行
  const wuXing = Math.floor(gan / 2);
  // 生克
  const shengKe = (wuXing - Math.floor(ri / 2) + 5) % 5;

  // 是否同性
  const isTongXing = (gan - ri + 10) % 2;

  return shiShenRelation(shengKe, isTongXing, shortLong);
}
function shiShenRelation(
  shengKe = 0,
  isTongXing = 0,
  shortLong: "short" | "long" = "short"
) {
  const shiShenList = {
    long: [
      ["比肩", "劫财"],
      ["食神", "伤官"],
      ["偏财", "正财"],
      ["七杀", "正官"],
      ["偏印", "正印"],
    ],
    short: [
      ["比", "劫"],
      ["食", "伤"],
      ["才", "财"],
      ["杀", "官"],
      ["枭", "印"],
    ],
  };

  return shiShenList[shortLong][shengKe][isTongXing];
}
