import * as Astronomy from "./astronomy.js";
import { DateTime, FixedOffsetZone } from "./luxon.js";
const button = document.getElementById("btn");
const radiosYearGan = document.querySelectorAll('input[name="year-gan"]');
const radiosYearZhi = document.querySelectorAll('input[name="year-zhi"]');
const radiosMonthZhi = document.querySelectorAll('input[name="month-zhi"]');
const radiosDayGan = document.querySelectorAll('input[name="day-gan"]');
const radiosDayZhi = document.querySelectorAll('input[name="day-zhi"]');
const radiosHourZhi = document.querySelectorAll('input[name="hour-zhi"]');
const longitude = document.getElementById("longitude");
const latitude = document.getElementById("latitude");
const height = document.getElementById("height");
const ul = document.getElementById("result-date");

function init() {
  const zoneOffsetInMinutes = -new Date().getTimezoneOffset();
  longitude.placeholder = zoneOffsetInMinutes / 4;
  latitude.placeholder = 30;
  height.placeholder = 0;
}
init();
button.addEventListener("click", function () {
  // 在这里编写你的函数逻辑
  const selectedYearGan = findSelectedOptionIndex(radiosYearGan);
  const selectedYearZhi = findSelectedOptionIndex(radiosYearZhi);
  const selectedMonthZhi = findSelectedOptionIndex(radiosMonthZhi);
  const selectedDayGan = findSelectedOptionIndex(radiosDayGan);
  const selectedDayZhi = findSelectedOptionIndex(radiosDayZhi);
  const selectedHourZhi = findSelectedOptionIndex(radiosHourZhi);
  if (
    selectedYearGan !== -1 &&
    selectedYearZhi !== -1 &&
    selectedMonthZhi !== -1 &&
    selectedDayGan !== -1 &&
    selectedDayZhi !== -1 &&
    selectedHourZhi !== -1
  ) {
    if (
      (selectedYearGan - selectedYearZhi) % 2 != 0 ||
      (selectedDayGan - selectedDayZhi) % 2 != 0
    ) {
      alert(
        "Year Gan-Zhi should be both odd/even.\n Day Gan-Zhi should be both odd/even"
      );
      return;
    }
    let longitudeValue =
      longitude.value !== "" ? longitude.value : longitude.placeholder;
    if (longitudeValue > 180 || longitudeValue < -180) {
      alert(
        "The longitude should be in the range [-180, 180], with east being positive.\nOtherwise, it would be set to zero."
      );
      longitude.value = 0;
      longitudeValue = 0;
    }

    let latitudeValue =
      latitude.value !== "" ? latitude.value : latitude.placeholder;
    if (latitudeValue > 90 || latitudeValue < -90) {
      alert(
        "The latitude should be in the range [-90, 90], with north being positive.\nOtherwise, it would be set to zero."
      );
      latitude.value = 0;
      latitudeValue = 0;
    }

    const heightValue = height.value !== "" ? height.value : height.placeholder;
    const re = convertGanzhiDatetime(
      selectedYearGan + 1,
      selectedYearZhi - 1 > 0 ? selectedYearZhi - 1 : selectedYearZhi + 11,
      selectedMonthZhi - 1 > 0 ? selectedMonthZhi - 1 : selectedMonthZhi + 11,
      selectedDayGan + 1,
      selectedDayZhi - 1 > 0 ? selectedDayZhi - 1 : selectedDayZhi + 11,
      selectedHourZhi - 1 > 0 ? selectedHourZhi - 1 : selectedHourZhi + 11,
      Number(longitudeValue)
    );
    const zone = FixedOffsetZone.instance(longitudeValue * 4);
    // 清空 <ul> 元素的内容
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    // 遍历数组并为每个项创建 <li> 元素
    re.forEach((item) => {
      const li = document.createElement("li");
      const jdut = (item - 2440587.5) * 86400000 - longitudeValue * 4 * 60000;
      const day2 = DateTime.fromMillis(jdut, {
        zone: zone,
      });
      li.textContent = day2.toFormat("yyyy -MM-dd HH:mm:ss Z");
      const link = document.createElement("a");
      link.href =
        "/ssbazi?ts=" +
        day2.toMillis() +
        "&offset=" +
        longitudeValue * 4 +
        "&lon=" +
        longitudeValue +
        "&lat=" +
        latitudeValue +
        "&height=" +
        heightValue; // 添加你想要的链接地址
      // console.log("href", link.href);
      link.textContent = "Chart"; // 添加链接文本
      li.appendChild(link); // 将链接添加到<li>元素中
      ul.appendChild(li); // 将 <li> 添加到 <ul> 中
    });
  } else {
    alert("Complete Gan-Zhi selection first.");
    return;
  }
});
function findSelectedOptionIndex(nodeList) {
  const optionsArray = Array.from(nodeList); // 将类数组对象转换为数组
  return optionsArray.findIndex((option) => option.checked);
}
function convertGanzhiDatetime(
  yearGan,
  yearZhi,
  month,
  dayGan,
  dayZhi,
  hour,
  longitude,
  rangeMin = 0,
  rangeMax = 2100
) {
  function ganzhiSequence(gan, zhi) {
    const ganzhi = (6 * gan - 5 * zhi) % 60;
    return ganzhi < 0 ? ganzhi + 60 : ganzhi;
  }
  const obserser = new Astronomy.Observer(
    latitude.value ? Number(latitude.value) : 30,
    longitude,
    height.value ? Number(height.value) : 0
  );
  let MonthUTStore = [0, 0];
  function calculateMonthStart(startDate, month, longitude, i) {
    const targetSunLonDeg = (285 + 30 * month) % 360;
    const date = Astronomy.AstroTime.FromTerrestrialTime(
      startDate + 30.43685 * (month - 1) - 5 - 2451545.0
    );

    const t0 = Astronomy.SearchSunLongitude(targetSunLonDeg, date, 20);
    //actually no need to carry the 2451545.0 all the time ...

    const tMonthUT = t0.ut + 2451545.0;
    //if use lmt then dont calculate the hour angle here,
    //by the way, use the hour angle geocentric is a astrological tradition,
    //but use hour angle with location make a little more sense, here, we use the real one....
    const hourAngleToDay = Astronomy.HourAngle("Sun", t0.ut, obserser) / 24;
    const tMonthLocal = tMonthUT + longitude / 360;
    const integerPart = Math.floor(tMonthLocal);
    const fractionalPart = tMonthLocal - integerPart;
    let lat;
    if (fractionalPart + 0.5 < hourAngleToDay) {
      lat = integerPart - 1 + hourAngleToDay;
    } else if (hourAngleToDay + 0.5 < fractionalPart) {
      lat = integerPart + 1 + hourAngleToDay;
    } else {
      lat = integerPart + hourAngleToDay;
    }
    //of the final display time is lat, here MonthUTStore[i] = lat
    MonthUTStore[i] = tMonthLocal;
    return lat - 0.5 + 15 / 360;
  }

  const yearSq = ganzhiSequence(yearGan, yearZhi);
  //minus 1, since the day squence start at 1...
  const daySq = ganzhiSequence(dayGan, dayZhi) - 1;
  //const tStart = -7 + yearSq + Math.floor(rangeMin / 60) * 60;
  // the year start searching, -6 is the first 甲寅(year sq 1) year before christ
  const tStart =
    1718902.236817819 +
    (yearSq - 1) * 365.2420962236746 +
    Math.floor(rangeMin / 60) * 60 * 365.2420962236746;

  const result = [];
  for (let i = 0; i < 1000; i++) {
    //the estimate et 立春 of the year
    const yearCal = tStart + i * 60 * 365.2420962236746;
    //a new 立春, larger than the estimated last day in ET of the rangeMax year.
    if (yearCal >= rangeMax * 365.2420962236746 + 1721424.6220664347) break;
    //It is the month start and end of the true GanZhi day system (we take 23:00 as start of day and LAT into account)
    const tMonthStartUT = calculateMonthStart(yearCal, month, longitude, 0);
    const tMonthEndUT = calculateMonthStart(yearCal, month + 1, longitude, 1);

    const MonthStartPrep = tMonthStartUT % 60;
    const MonthEndPrep = tMonthEndUT % 60;
    const MonthStart =
      MonthStartPrep < 0 ? MonthStartPrep + 60 : MonthStartPrep;
    const MonthEnd = MonthEndPrep < 0 ? MonthEndPrep + 60 : MonthEndPrep;

    let dGanZhiStart, dGanZhiEnd, dGanZhiMiddle;

    if (hour === 11) {
      dGanZhiStart = daySq;
      dGanZhiMiddle = daySq + 0.5 / 12;
      dGanZhiEnd = daySq + 1 / 12;
    } else if (hour === 12) {
      dGanZhiStart = daySq + 1 / 12;
      dGanZhiMiddle = daySq + 1.5 / 12;
      dGanZhiEnd = daySq + 2 / 12;
    } else {
      dGanZhiStart = daySq + (hour + 1) / 12;
      dGanZhiMiddle = daySq + (hour + 1.5) / 12;
      dGanZhiEnd = daySq + (hour + 2) / 12;
    }
    if (MonthStart < MonthEnd) {
      if (MonthStart <= dGanZhiMiddle && MonthEnd >= dGanZhiMiddle) {
        result.push(MonthUTStore[0] + dGanZhiMiddle - MonthStart);
      } else if (MonthStart <= dGanZhiStart && MonthEnd >= dGanZhiStart) {
        result.push(MonthUTStore[0] + dGanZhiStart - MonthStart);
      } else if (MonthStart <= dGanZhiEnd && MonthEnd > dGanZhiEnd) {
        result.push(MonthUTStore[0] + dGanZhiEnd - MonthStart);
      } else {
        continue;
      }
    } else if (MonthStart <= dGanZhiMiddle) {
      result.push(MonthUTStore[0] + dGanZhiMiddle - MonthStart);
    } else if (dGanZhiMiddle < MonthEnd) {
      result.push(MonthUTStore[1] + dGanZhiMiddle - MonthEnd);
    } else if (dGanZhiStart < MonthEnd) {
      result.push(MonthUTStore[1] + dGanZhiStart - MonthEnd);
    } else if (MonthStart <= dGanZhiEnd) {
      result.push(MonthUTStore[0] + dGanZhiEnd - MonthStart);
    }
  }
  return result;
}
//an example
// const start_time = new Date().getTime();
// const result = convertGanzhiDatetime(1, 9, 1, 1, 11, 11, 116.5);
// const end_time = new Date().getTime();
// console.log(result);
// console.log(`Elapsed time: ${end_time - start_time} ms`);
