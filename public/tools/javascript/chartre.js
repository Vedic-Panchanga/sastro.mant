"using strict";
// import { DateTime } from "./luxon.js";
import * as Astronomy from "./astronomy.js";
const select = document.querySelectorAll(".select");
const clearBtn = document.getElementById("clear");

const inputDMS = document.querySelectorAll("input");
const possibleDates = document.getElementById("chartre");
const ul = document.getElementById("result-date");
clearBtn.addEventListener("click", function () {
  inputDMS.forEach((input) => {
    input.value = "";
  });
});

inputDMS.forEach((input, idx) => {
  input.addEventListener("input", (e) => {
    if (
      idx < 14 &&
      idx % 3 !== 0 &&
      (e.target.value >= 6 || e.target.value.length === 2)
    ) {
      setTimeout(() => inputDMS[idx + 1].focus(), 10);
    }
    if (idx % 3 === 0 && (e.target.value >= 3 || e.target.value.length === 2)) {
      setTimeout(() => inputDMS[idx + 1].focus(), 10);
    }
  });
});

possibleDates.addEventListener("click", function () {
  const requiredIndices = [0, 1, 3, 4, 6, 7];
  let emptyFound = false;

  Array.from(inputDMS).forEach((input, index) => {
    if (requiredIndices.includes(index) && input.value === "") {
      emptyFound = true;
    }
  });

  if (emptyFound) {
    alert("Tell us the positions of the Sun, Moon and Saturn...");
    return;
  }
  // console.log("Al ho survive!");
  // re is a list of possible datetime [time, foundSunLon - targetSunLon,foundMoonLon - targetMoonLon,foundSaturnLon - targetSaturnLon]
  // re is a list of possible datetime [time, foundSunLon - targetSunLon,foundMoonLon - targetMoonLon,foundSaturnLon - targetSaturnLon]
  const re = convertChartDateTime(
    Number(inputDMS[0].value) +
      select[0].selectedIndex * 30 +
      inputDMS[1].value / 60 +
      inputDMS[2].value / 3600,
    Number(inputDMS[3].value) +
      select[1].selectedIndex * 30 +
      inputDMS[4].value / 60 +
      inputDMS[5].value / 3600,
    Number(inputDMS[6].value) +
      select[2].selectedIndex * 30 +
      inputDMS[7].value / 60 +
      inputDMS[8].value / 3600
  );
  // 清空 <ul> 元素的内容
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  if (re.length > 0) {
    // 遍历数组并为每个项创建 <li> 元素
    re.forEach((item) => {
      const li = document.createElement("li");
      const li2 = document.createElement("li");
      const li3 = document.createElement("li");
      const li4 = document.createElement("li");
      li.textContent = item[0].date.toUTCString();
      li.textContent = item[0].date.toUTCString();
      li2.textContent = `Diff: Sun ${item[3].toFixed(6)}`;
      li3.textContent = `Diff: Moon ${item[1].toFixed(6)}`;
      li4.textContent = `Diff: Saturn ${item[2].toFixed(6)}`;
      ul.appendChild(li); // 将 <li> 添加到 <ul> 中
      ul.appendChild(li2); // 将 <li> 添加到 <ul> 中
      ul.appendChild(li3); // 将 <li> 添加到 <ul> 中
      ul.appendChild(li4); // 将 <li> 添加到 <ul> 中
      //Great! then we need to figure out the locations
      let lon = 0;
      let lat = 0;
      if (inputDMS[12].value) {
        const geoMCLon =
          Number(inputDMS[12].value) +
          select[4].selectedIndex * 30 +
          Number(inputDMS[13].value / 60) +
          Number(inputDMS[8].value / 3600);
        const timeUT = item[0];
        const sidTime = Astronomy.SiderealTime(timeUT);
        const mcECTSphere = new Astronomy.Spherical(0, geoMCLon, 1);
        const mcECTVector = Astronomy.VectorFromSphere(mcECTSphere, timeUT);
        const mcRot = Astronomy.Rotation_ECT_EQD(timeUT);
        const mcEQDVector = Astronomy.RotateVector(mcRot, mcECTVector);
        const mcEQDSphere = Astronomy.SphereFromVector(mcEQDVector);

        let lonFound = mcEQDSphere.lon - sidTime * 15;
        if (lonFound > 180) {
          lonFound = lonFound - 360;
        } else if (lonFound < -180) {
          lonFound = lonFound + 360;
        }
        const li1 = document.createElement("li");
        const desc = lonFound > 0 ? "(east positive)" : "(west negative)";
        li1.textContent = `\nLongitude: ${decimalToDMS(lonFound)} ${desc}`;
        lon = lonFound;
        li1.textContent = `\nLongitude: ${decimalToDMS(lonFound)} ${desc}`;
        lon = lonFound;
        ul.appendChild(li1);
        if (inputDMS[9].value) {
          const geoASCLon =
            Number(inputDMS[9].value) +
            select[3].selectedIndex * 30 +
            Number(inputDMS[10].value / 60) +
            Number(inputDMS[11].value / 3600);
          const e = (Astronomy.e_tilt(timeUT).tobl / 360) * 2 * Math.PI;
          const theta = ((sidTime + lonFound / 15) / 24) * 2 * Math.PI;
          const fi = Math.atan(
            (-Math.cos(theta) / Math.tan((geoASCLon / 180) * Math.PI) -
              Math.sin(theta) * Math.cos(e)) /
              Math.sin(e)
          );
          const li5 = document.createElement("li");
          lat = (fi / Math.PI) * 180;
          if (!Number.isNaN(fi)) {
            lat = (fi / Math.PI) * 180;
            if (!Number.isNaN(fi)) {
              const desc = fi > 0 ? "(north positive)" : "(south negative)";
              li5.textContent = `Latitude: ${decimalToDMS(lat)} ${desc}`;
              li5.textContent = `Latitude: ${decimalToDMS(lat)} ${desc}`;
            } else {
              li5.textContent = `Latitude not found.`;
            }

            ul.appendChild(li5);
          }
        }
        // 创建一个新的按钮元素
        const chartButton = document.createElement("button");
        chartButton.type = "button";
        chartButton.textContent = "Chart";
        chartButton.id = "chart";
        // 为按钮添加样式
        // chartButton.style.display = "flex";
        chartButton.style.flexShrink = "0"; // 防止在横向上收缩
        // 将新的按钮元素添加到 <ul> 中
        ul.appendChild(chartButton);
        console.log(item[0].ut, (item[0].ut + 10957.5) * 86400000);
        // 监听按钮点击事件
        chartButton.addEventListener("click", function () {
          // 构建目标 URL，将参数添加到查询字符串中
          const targetUrl = `/sschart?ts=${Math.floor(
            (item[0].ut + 10957.5) * 86400000
          )}&lon=${lon}&lat=${lat}&offset=${0}`;

          // 执行页面跳转
          window.location.href = targetUrl;
        });
      }
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Nothing found.";
    ul.appendChild(li);
  }
  // const endTime = performance.now();
  // const executionTime = endTime - startTime;
  // console.log("Your function took " + executionTime + " milliseconds to run");
});
function decimalToDMS(decimalDegree) {
  const dec = Math.abs(decimalDegree);
  const degrees = Math.floor(dec);
  const minutes = Math.floor((dec - degrees) * 60);
  const seconds = ((dec - degrees - minutes / 60) * 3600).toFixed(2);

  return `${degrees}° ${Math.abs(minutes)}' ${Math.abs(seconds)}"`;
}
function convertChartDateTime(sun, moon, saturn) {
  const result = [];
  // console.log(`${sun}`);
  const observer = new Astronomy.Observer(0.0, 0.0, 0.0);
  // from year 100 to year 2100, about 67 orbit period of saturn
  // three time hit a certern lon at most
  //1. have an estimation of where saturn is.
  // Using sinA/a = sinB/B, semi-major of saturn is about 9.573
  const saturnHelio =
    (Math.asin(Math.sin(((saturn - sun) / 180) * Math.PI) / 9.573) * 180) /
      Math.PI +
    saturn;
  for (let i = 0; i < 70; i++) {
    //2. have an estimation of when in the orbital cycle is our saturn
    // 10746.5181971891777558 is orbital period in day, 1730186.643612854 is our start point when saturn's longitude is 0
    // and the  360.0 / 10746.5181971891777558 is saturn's speed in (degree per day)
    const t0 =
      10746.5181971891777558 * i +
      1730186.643612854 +
      (saturnHelio / 360.0) * 10746.5181971891777558 -
      2451545.0;
    //3. that estimation have error less than 10 degrees in 2000 years.
    // which means the possible dates is 10 degrees / degree per day, which never more than 303 days to the estimation.
    // in the two years time, only two dates need to be examined: check the saturn and the moon in these two day.

    const t1 = Astronomy.SearchSunLongitude(sun, t0 - 365, 365);
    const t2 = Astronomy.SearchSunLongitude(sun, t0, 365);
    let moonGeo;
    if (t1) {
      const equator = Astronomy.Equator("Saturn", t1, observer, false, true);
      const ect = Astronomy.Ecliptic(equator.vec);
      //0.02 is the tolarence set here. it is about 1 arcminute
      if (Math.abs(ect.elon - saturn) < 0.05) {
        moonGeo = Astronomy.EclipticGeoMoon(t1).lon;
        if (Math.abs(moonGeo - moon) < 1) {
          result.push([
            t1,
            moonGeo - moon,
            ect.elon - saturn,
            Astronomy.SunPosition(t1).elon - sun,
          ]);
        }
      }
    }
    if (t2) {
      const equator = Astronomy.Equator("Saturn", t2, observer, false, true);
      const ect = Astronomy.Ecliptic(equator.vec);
      if (Math.abs(ect.elon - saturn) < 0.05) {
        moonGeo = Astronomy.EclipticGeoMoon(t2).lon;
        if (Math.abs(moonGeo - moon) < 1) {
          result.push([
            t2,
            moonGeo - moon,
            ect.elon - saturn,
            Astronomy.SunPosition(t2).elon - sun,
          ]);
        }
      }
    }
    // const saturnTime = Astronomy.Search(
    //   (t) => Astronomy.EclipticLongitude("Saturn", t) - saturn,
    //   new Astronomy.AstroTime(t1 - 16 - 2451545.0),
    //   new Astronomy.AstroTime(t1 + 16 - 2451545.0)
    // );
  }
  return result;
}

// //for test purpose
inputDMS[0].value = 1;
inputDMS[1].value = 36;
//inputDMS[2].value = 36;
select[0].selectedIndex = 8;
inputDMS[0].value = 1;
inputDMS[1].value = 36;
//inputDMS[2].value = 36;
select[0].selectedIndex = 8;

inputDMS[3].value = 1;
inputDMS[4].value = 52;
//inputDMS[5].value = 0;
select[1].selectedIndex = 2;
inputDMS[3].value = 1;
inputDMS[4].value = 52;
//inputDMS[5].value = 0;
select[1].selectedIndex = 2;

inputDMS[6].value = 1;
inputDMS[7].value = 10;
//inputDMS[8].value = 0;
select[2].selectedIndex = 9;
inputDMS[6].value = 1;
inputDMS[7].value = 10;
//inputDMS[8].value = 0;
select[2].selectedIndex = 9;

inputDMS[9].value = 10;
inputDMS[10].value = 0;
select[3].selectedIndex = 9;
inputDMS[9].value = 10;
inputDMS[10].value = 0;
select[3].selectedIndex = 9;

inputDMS[12].value = 5;
inputDMS[13].value = 47;
select[4].selectedIndex = 7;
inputDMS[12].value = 5;
inputDMS[13].value = 47;
select[4].selectedIndex = 7;
