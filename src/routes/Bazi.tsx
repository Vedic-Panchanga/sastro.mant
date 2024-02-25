import {
  year2Ganzhi,
  day2Ganzhi,
  ganList,
  zhiList,
  jdut2DateTime,
  timestamp2jdut,
  // timestamp2Jd,
} from "../utils";
import { Pillar, SmallPillar } from "../bazi-components/BaziPillar";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { type DateTimeT, Location } from "./Root";
import astrologer from "../astrologer";
import { DateTime, FixedOffsetZone } from "luxon";
import TabsTwo from "../components/TabsTwo";
import classes from "./Bazi.module.css";
import ModalActionIcon from "../components/ModalActionIcon";
import { atomWithStorage } from "jotai/utils";
type WasmType = {
  jd_ut: number;
  e: number;
  SUN_tropical: number;
  year_chinese: number;
};
const jie = [
  "立春",
  "惊蛰",
  "清明",
  "立夏",
  "芒种",
  "小暑",
  "立秋",
  "白露",
  "寒露",
  "立冬",
  "大雪",
  "小寒",
];
const lmtOrLatAtom = atomWithStorage("isLMT", true);
export default function Bazi() {
  // hooks
  const [dateTime, , location]: [DateTimeT, never, Location] =
    useOutletContext();
  const [wasm, setWasm] = useState<WasmType | undefined>(undefined);
  //get data
  useEffect(() => {
    setWasm(undefined);

    astrologer(
      timestamp2jdut(dateTime.toMillis()),
      -1,
      location.longitude,
      location.latitude,
      location.height,
      "W",
      258,
      4 | 8
    )
      .then((wasm) => {
        setWasm(wasm);
        console.log("baziwasm", wasm);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error
      });
  }, [dateTime, location]);

  return (
    wasm && (
      <BaziDisplay
        wasm={wasm!}
        dateTime={dateTime}
        geoLon={location.longitude}
      />
    )
  );
}
function BaziDisplay({
  wasm,
  geoLon,
  dateTime,
}: {
  wasm: WasmType;
  geoLon: number;
  dateTime: DateTimeT;
}) {
  //Hooks
  const [gender, setGender] = useState(true); //true for male, false for female
  const [type, setType] = useState(true); //true for LMT, false for LAT
  //calc
  const [zi1Num, zi2Num] = year2Ganzhi(wasm.year_chinese);
  const monthChinese = Math.floor((wasm.SUN_tropical + 45) / 30) % 12;

  const monthGan = (zi1Num * 2 + monthChinese + 2) % 10;
  const lmt = dateTime.setZone(FixedOffsetZone.instance(geoLon * 4));
  const time = type ? lmt : lmt.plus({ millisecond: wasm.e * 86400000 });
  const jd_local = wasm.jd_ut + geoLon / 360;
  const [zi5Num, zi6Num] = day2Ganzhi(jd_local);

  const hourChinese = Math.floor((time.hour + 21) / 2) % 12;
  // console.log("hour", time.hour, hourChinese);
  //Transit-related
  // 大运，流年，流月

  const shunNi = (((gender ? 1 : 0) ^ wasm.year_chinese) % 2) * 2 - 1; // 逆-1, 顺1. e.g. 2023 male, then gender(true) ^ (2023%2)
  const coverDeg =
    shunNi === -1
      ? (wasm.SUN_tropical + 15) % 30
      : (-wasm.SUN_tropical + 375) % 30;
  const qiYunDeg = coverDeg * 120; //理想的话，应该从qiYunDeg计算qiYun
  const qiYunYear =
    wasm.year_chinese +
    Math.floor((((wasm.SUN_tropical + 45) % 360) + qiYunDeg) / 360);
  const qiYunMonth = (((wasm.SUN_tropical + 45) % 360) + qiYunDeg) % 360;
  const qiYunIndex = Math.floor(qiYunMonth / 30);
  const qiYunDay = qiYunMonth % 30;

  // const qiYunJieQi = Math.floor(((qiYunDeg + 45) % 360) / 30); //立春 is 0
  // const qiYun = dateTime.plus({
  //   millisecond: ((86400000 * 365.2421990741) / 3) * coverDeg,
  // });

  const [selectedDaYun, setSelectedDaYun] = useState(1);
  const [selectedLiuNian, setSelectedLiuNian] = useState(0);
  const [selectedLiuYue, setSelectedLiuYue] = useState(qiYunIndex);

  const selectedDaYunYear =
    selectedDaYun === 0
      ? wasm.year_chinese
      : qiYunYear + 10 * selectedDaYun - 10;
  const selectedLiuNianYear = selectedDaYunYear + selectedLiuNian;
  const selectedLiuNianGanZhi = year2Ganzhi(selectedLiuNianYear);
  const selectedLiuNianGan = selectedLiuNianGanZhi[0];
  const [jieList, setJieList] = useState<number[] | undefined>(undefined);
  const zone = FixedOffsetZone.instance(dateTime.offset);
  useEffect(() => {
    astrologer(
      timestamp2jdut(
        DateTime.fromObject({
          year: selectedLiuNian + selectedDaYun * 10 + qiYunYear,
          month: 6,
        }).toMillis()
      ),
      -1,
      0,
      0,
      0,
      "W",
      258,
      16 | 8
    )
      .then((wasm) => {
        setJieList(wasm.jieqi);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error
      });
  }, [selectedLiuNian, selectedDaYun, qiYunYear]);

  return (
    jieList && (
      <div className={classes.container}>
        <div className={classes.tabsStack}>
          <TabsTwo
            option={gender}
            setOption={setGender}
            optionLabel={["Female", "Male"]}
          />
          <TabsTwo
            option={type}
            setOption={setType}
            optionLabel={["LAT", "LMT"]}
          />
        </div>
        <div>
          {type ? `LMT: ` : `LAT: `}
          {time.toFormat("yyyy-MM-dd HH:mm:ss")}
        </div>
        <div className={classes.fourPillar}>
          <Pillar title={"年柱"} ri={zi5Num} gan={zi1Num} zhi={zi2Num} />
          <Pillar
            title={"月柱"}
            ri={zi5Num}
            gan={monthGan}
            zhi={monthChinese}
          />
          <Pillar
            title={"日柱"}
            ri={zi5Num}
            gan={zi5Num}
            zhi={zi6Num}
            gender={gender ? "男主" : "女主"}
          />
          <Pillar
            title={"时柱"}
            ri={zi5Num}
            gan={(zi5Num * 2 + hourChinese + 2) % 10}
            zhi={hourChinese}
          />
          {/* <div className="col vertical-line"></div> */}

          <Pillar
            title={"大运"}
            ri={zi5Num}
            gan={(monthGan + shunNi * selectedDaYun + 10) % 10}
            zhi={(monthChinese + shunNi * selectedDaYun + 12) % 12}
          />
          <Pillar
            title={"流年"}
            ri={zi5Num}
            gan={selectedLiuNianGanZhi[0]}
            zhi={selectedLiuNianGanZhi[1]}
          />
          <Pillar
            title={"流月"}
            ri={zi5Num}
            gan={(selectedLiuNianGan * 2 + selectedLiuYue + 2) % 10}
            zhi={selectedLiuYue}
          />
        </div>
        {/* <div className="col">
      起运：
      {qiYun.toFormat("yyyy-MM-dd HH:mm:ss")}
    </div> */}
        <div className="stack">
          起运：
          {ganList(year2Ganzhi(qiYunYear)[0]).char}
          {zhiList(year2Ganzhi(qiYunYear)[1]).char}
          {"，"}
          {jie[qiYunIndex]}
          之后
          {qiYunDay.toFixed(1)}天<ExplainQiyun />
        </div>
        <strong className={classes.stack}>大运</strong>
        <div className={classes.stack}>
          {Array.from({ length: 10 }, (_, index) => (
            <SmallPillar
              key={index}
              title1={
                index === 0 ? "小运" : (qiYunYear + index * 10 - 10).toString()
              }
              title2={
                (index === 0
                  ? 0
                  : qiYunYear + index * 10 - 10 - wasm.year_chinese) + "岁"
              }
              ri={zi5Num}
              gan={(monthGan + shunNi * index + 10) % 10}
              zhi={(monthChinese + shunNi * index + 12) % 12}
              selected={selectedDaYun === index}
              onClick={() => setSelectedDaYun(index)}
            ></SmallPillar>
          ))}
        </div>
        <strong className={classes.stack}>流年</strong>
        <div className={classes.stack}>
          {Array.from(
            {
              length:
                selectedDaYun === 0 ? qiYunYear - wasm.year_chinese + 1 : 11,
            },
            (_, index) => {
              const year = year2Ganzhi(selectedDaYunYear + index);
              return (
                <SmallPillar
                  key={index}
                  title1={(selectedDaYunYear + index).toString()}
                  title2={selectedDaYunYear + index - wasm.year_chinese + "岁"}
                  ri={zi5Num}
                  gan={year[0]}
                  zhi={year[1]}
                  selected={selectedLiuNian === index}
                  onClick={() => setSelectedLiuNian(index)}
                ></SmallPillar>
              );
            }
          )}
        </div>
        <strong className={classes.stack}>流月</strong>
        <div className={classes.stack}>
          {jie.map((jieName, index) => {
            const monthTime = jieList[index * 2];
            const parseJieTime = jdut2DateTime(monthTime, zone);
            return (
              <SmallPillar
                key={index}
                title1={jieName}
                title2={`${parseJieTime.month}/${parseJieTime.day}`}
                ri={zi5Num}
                gan={(selectedLiuNianGan * 2 + index + 2) % 10}
                zhi={index}
                selected={selectedLiuYue === index}
                onClick={() => setSelectedLiuYue(index)}
                valid={
                  !(
                    (selectedDaYun !== 0 &&
                      selectedLiuNianYear % 10 === qiYunYear % 10 &&
                      ((selectedLiuNian === 0 && qiYunIndex > index) ||
                        (selectedLiuNian !== 0 && qiYunIndex < index))) ||
                    (selectedDaYun === 0 &&
                      selectedLiuNianYear % 10 === qiYunYear % 10 &&
                      qiYunIndex < index)
                  )
                }
              ></SmallPillar>
            );
          })}
        </div>
      </div>
    )
  );
}
function ExplainQiyun() {
  return (
    <ModalActionIcon modalHeading="起運方法">
      <>
        傳統八字，十年一大運。
        而起運時間，根據生日（或順或逆）到下一個節氣的時間，推算起運開始時間：三天一年，一天四月，一時五天，等等。
      </>
      <p>
        如果是了解一點占星的朋友，更簡單的解釋是：
        <li>出生後，本命盤太陽走1天，相當於推運盤太陽走120度。</li>
        <li>
          到達第一個星座換座之後，本命盤太陽走1度，相當於推運盤太陽走120度。
        </li>
        二者之間的時間，即為起運。推運盤太陽的方向，根據年份和性別，或正或逆。
      </p>
      <p>
        為什麼出生後，1天相當於120度，到達第一次交宮之後，1度相當於120度？因為這樣，簡單，好算。看看日曆，就可以計算出來了。
        其他的因素，比如，太陽時快時慢，太陽本身一天也並不走一度，都可以忽略不計！
      </p>
      <p>如今，我們有了更好的計算方法，可以並不執著於這個方法。</p>
      <p>
        這裡，我的計算方法非常簡單：
        <strong>
          本命盤太陽走1度，相當於推運盤太陽走120度，出生後一律如此。
        </strong>
      </p>
      <p>它很有可能和傳統方式有差別，但是通常最多也只是幾個月。</p>
    </ModalActionIcon>
  );
}
