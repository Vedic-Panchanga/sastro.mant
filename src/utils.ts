import { DateTime, FixedOffsetZone } from "luxon";
import { Planet } from "./routes/Chart";
/**
 *
 * @param deg [0,360)
 * @returns {zodiac, minute, second}
 */
export function parseDegree(deg: number): {
  zodiac: number;
  degree: number;
  minute: number;
} {
  const zodiac = Math.floor(deg / 30);
  const remainder = deg % 30;
  const degree = Math.floor(remainder);
  const minute = Math.floor((remainder - degree) * 60);
  return { zodiac, degree, minute };
}
export function parseDegreeNoZodiac(deg: number) {
  const degree = Math.floor(deg);
  const minute = Math.floor((deg - degree) * 60);
  const second = Math.round(((deg - degree) * 60 - minute) * 60);
  return { degree, minute, second };
}
// export function degreesToRadians(degree: number) {
//   return degree * (Math.PI / 180);
// }
export function zodiacSymbol(zodiac: number) {
  return String.fromCharCode(zodiac + 9800) + "\u{FE0E}";
}
export function planetsSymbol(planetIndex: string | number, retText = false) {
  const planetSymbols: Record<number | string, [string, string]> = {
    0: ["\u{2609}", "Sun"],
    1: ["\u{263D}", "Moon"],
    2: ["\u{263F}", "Mercury"],
    3: ["\u{2640}", "Venus"],
    4: ["\u{2642}", "Mars"],
    5: ["\u{2643}", "Jupiter"],
    6: ["\u{2644}", "Saturn"],
    7: ["\u{2645}", "Uranus"],
    8: ["\u{2646}", "Neptune"],
    9: ["\u{2BD3}", "Pluto"],
    17: ["\u{26B3}", "Ceres"],
    18: ["\u{26B4}", "Pallas"],
    19: ["\u{26B5}", "Juno"],
    20: ["\u{26B6}", "Vesta"],
    15: ["\u{26B7}", "Chiron"],
    16: ["\u{2BDB}", "Pholus"],
    12: ["\u{26B8}", "Lilith"],
    13: ["\u{2BDE}", "Lilith"],
    10: ["\u{260A}", "Node"],
    11: ["\u{00C0}", "Node"],
    110: ["\u{260B}", "South Node"],
    111: ["\u{00C1}", "South Node"],
    14: ["\u{1F728}", "Earth"],
    "-2": ["\u{1F70A}", "Vertex"],
    "-3": ["\u{1F774}", "Fortune"],
    "-4": ["Asc", "Ascendent"],
    "-5": ["Dsc", "Descendent"],
    "-6": ["MC", "Midheaven"],
    "-7": ["IC", "Nadir"],
    "-8": ["EP", "East Point"],
    "-9": ["Sp", "Spirit"],
  };
  return planetSymbols[planetIndex][+retText];
}
export function colorTheme(element: number) {
  const colors = ["#cc0000", "#f1c232", "#3d85c6", "#6aa84f"];
  return colors[element];
}

export function avoidCollision(degreesList: Record<string, Planet>, diff = 5) {
  //flatten
  const degrees = Object.fromEntries(
    Object.keys(degreesList)
      .filter((key) => degreesList[key].shown !== false)
      .map((key) => [key, degreesList[key].lon])
  );
  const keys = Object.keys(degrees);
  type Group = [string[], number, number];
  const groups: Group[] = keys.map((planet) => [[planet], degrees[planet], 0]); // group element, center, radius
  groups.sort((a, b) => a[1] - b[1]);
  for (let _ = 0; _ < 10; _++) {
    // the for loop above could be while (true)
    let flag = true;
    let index = 0;
    while (index < groups.length) {
      const groupsLength = groups.length;
      const nextIndex = (index + 1) % groupsLength;
      // if these two group cover 360 deg? compare the center points of two groups of planets
      const boolOver360 = groups[index][1] <= groups[nextIndex][1];
      // if they collide? compare [the distance of (the first group's last element) and (the first element of the second group)] with diff
      const boolMerge =
        groups[index][1] + groups[index][2] + diff >=
        groups[nextIndex][1] - groups[nextIndex][2] + (boolOver360 ? 0 : 360);
      // great, if they collide, we merge these two groups and delete the useless one.
      if (boolMerge) {
        // merge the two group to the first
        groups[index][0] = groups[index][0].concat(groups[nextIndex][0]);
        groups[index][1] = middle(
          degrees[groups[index][0][groups[index][0].length - 1]],
          degrees[groups[index][0][0]]
        );
        groups[index][2] = ((groups[index][0].length - 1) * diff) / 2;
        // delete the second
        groups.splice(nextIndex, 1);
        flag = false;
      } else {
        // merge keep the index, non-merge need index++ to check the next group
        index++;
      }
    }
    // flag === true means: after a around, no collision found
    if (flag) {
      break;
    }
  }
  // Reconstruction:
  // Use the group info [element index list, center, radius], to calculate the non-collision degrees.
  groups.forEach((group) => {
    const n = group[0].length;
    if (n === 1) {
      return;
    }
    const middle = group[1];
    group[0].forEach((planet: string | number, index: number) => {
      degrees[planet] = (middle - group[2] + diff * index) % 360;
    });
  });
  return degrees;
}
export function middle(degree1: number, degree2: number) {
  //degree1 >= degree2 if not cross 360, find the middle point, when degree2 counter-clockwise to degree1
  const middle = (degree1 + degree2) / 2;
  if (degree1 >= degree2) {
    return middle;
  } else {
    return (middle + 180) % 360;
  }
}
// function trisection(degree1, degree2) {
//   //degree1 >= degree2 if not cross 360, find the trisection points, when degree2 counter-clockwise to degree1
//   // Calculate the first and second trisection points
//   const deg1 = degree1 >= degree2 ? degree1 : degree1 + 360;
//   const trisect1 = (2 * deg1 + degree2) / 3;
//   const trisect2 = (deg1 + 2 * degree2) / 3;
//   return [trisect1 % 360, trisect2 % 360];
// }
export function distance(degree1: number, degree2: number) {
  //degree1 >= degree2 if not cross 360, find the distance, when degree1 cycles clockwise to degree2
  if (degree1 >= degree2) {
    return degree1 - degree2;
  } else {
    return degree1 + 360 - degree2;
  }
}
export function groupPlanetsByWholeHouse(degreesList: {
  [x: string]: { speed: number; lon: number; shown: boolean; name: string };
}) {
  // 将对象转换为数组 // wait, could i use the array method of groupby? emm, I prefer returning an array of 12.
  const degreeArray = Object.keys(degreesList)
    .filter((key) => degreesList[key].shown !== false)
    .map((key) => ({
      lon: degreesList[key].lon,
      name: degreesList[key].name,
      speed: degreesList[key].speed,
    }));
  // 根据 lon 属性排序
  degreeArray.sort((a, b) => a.lon - b.lon);
  // 根据 Math.floor(lon/30) 分组
  const resArray: string[][] = Array.from({ length: 12 }, () => []);
  degreeArray.forEach((element) => {
    resArray[Math.floor(element.lon / 30)].push(
      element.speed >= 0
        ? element.name.slice(0, 2)
        : `(${element.name.slice(0, 2)})`
    );
  });
  return resArray;
}
export function ifDegreeInOrb(targetDegree: number, degree: number, orb = 1) {
  const startPoint = targetDegree - orb;
  const endPoint = targetDegree + orb;
  return startPoint < 0
    ? degree >= startPoint || degree <= endPoint
    : degree >= startPoint && degree <= endPoint;
}
// Using index instead of name of planets and fixed stars
export function fixedStarName(fixedStarIndex: number) {
  const fixedStarList: Record<number, string> = {
    90: "鬼宿星团",
    120: "氐宿一",
    128: "五車二",
    129: "大角",
    130: "天狼",
    132: "南河三",
    135: "老人",
    137: "南門二",
    146: "貫索四",
    158: "北河二",
    166: "軒轅十四",
    171: "織女一",
    178: "參宿四",
    180: "室宿一",
    184: "北落師門",
    189: "心宿二",
    192: "天市右垣七",
    196: "畢宿五",
    // 203: "勾陳一，北極星",
    205: "角宿一",
    216: "奎宿九",
    251: "北河三",
    260: "五帝座一",
    262: "氐宿四",
    270: "參宿七",
    274: "大陵五",
    328: "壘壁陣四",
    333: "鬼宿四",
    339: "軫宿三",
    499: "昴宿六",
    500: "搖光，北斗七",
    505: "天大將軍一",
    527: "鬼宿三",
  };
  return fixedStarList[fixedStarIndex];
}

//Bazi-related
export function jdut2DateTime(jdut: number, zone: FixedOffsetZone) {
  return DateTime.fromMillis(Math.floor((jdut - 2440587.5) * 86400000)).setZone(
    zone
  );
}
export function timestamp2jdlocal(unixInteger: number, offset = 0) {
  return (unixInteger + offset * 60) / 86400 + 2440587.5;
}
export function timestamp2jdut(unixInteger: number) {
  return timestamp2jdlocal(unixInteger, 0);
}
export function day2GanzhiChar(jd: number) {
  const ganZhiNumber = day2Ganzhi(jd);
  return ganList(ganZhiNumber[0]).char + zhiList(ganZhiNumber[1]).char;
}
export function year2Ganzhi(year_chinese: number) {
  const year2JiaYin = 9966 + year_chinese;
  return [year2JiaYin % 10, year2JiaYin % 12];
}

export function day2Ganzhi(jd: number) {
  const day2JiaYin = Math.floor(-1 + 1 / 24 + jd);
  let gan = day2JiaYin % 10;
  let zhi = day2JiaYin % 12;
  if (gan < 0) gan += 10;
  if (zhi < 0) zhi += 12;
  return [gan, zhi];
}
export function ganList(gan: number) {
  const list = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  return { char: list[gan], wuXing: Math.floor(gan / 2) };
}
export function zhiList(zhi: number) {
  const list = [
    { char: "寅", wuXing: 0, cangGan: [0, 2, 4] },
    { char: "卯", wuXing: 0, cangGan: [1] },
    { char: "辰", wuXing: 2, cangGan: [4, 1, 9] },
    { char: "巳", wuXing: 1, cangGan: [2, 4, 6] }, //中气与余气顺序}
    { char: "午", wuXing: 1, cangGan: [3, 5] },
    { char: "未", wuXing: 2, cangGan: [5, 3, 1] }, //中气与余气顺序}
    { char: "申", wuXing: 3, cangGan: [6, 8, 4] },
    { char: "酉", wuXing: 3, cangGan: [7] },
    { char: "戌", wuXing: 2, cangGan: [4, 7, 3] },
    { char: "亥", wuXing: 4, cangGan: [8, 0] },
    { char: "子", wuXing: 4, cangGan: [9] },
    { char: "丑", wuXing: 2, cangGan: [5, 9, 7] },
  ];
  return list[zhi];
}
/**
 *
 * @param jieqiNumber sun longitude of this jieqi, [0,360)
 * @returns jieqi name
 */
export function jieqiList(jieqiNumber: number) {
  const list = [
    "立春",
    "雨水",
    "惊蛰",
    "春分",
    "清明",
    "谷雨",
    "立夏",
    "小满",
    "芒种",
    "夏至",
    "小暑",
    "大暑",
    "立秋",
    "处暑",
    "白露",
    "秋分",
    "寒露",
    "霜降",
    "立冬",
    "小雪",
    "大雪",
    "冬至",
    "小寒",
    "大寒",
  ];
  return list[((jieqiNumber + 45) % 360) / 15];
}
