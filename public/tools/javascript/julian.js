"use strict";
const y = document.getElementById("yearInput");
const month = document.getElementById("monthInput");
const d = document.getElementById("dayInput");
const h = document.getElementById("hourInput");
const minute = document.getElementById("minuteInput");
const s = document.getElementById("secondInput");
const ut = document.getElementById("utInput");
const tt = document.getElementById("ttInput");
const ts = document.getElementById("tsInput");
const tz = document.getElementById("time-zone");
const tss = document.getElementById("tssInput");

//clear button

function clearInput() {
  y.value = "";
  month.value = "";
  d.value = "";
  minute.value = "";
  h.value = "";
  s.value = "";
  ut.value = "";
  tt.value = "";
  ts.value = "";
  tss.value = "";
  tz.value = "";
  initCurrentDateTime();
}

const clear = document.getElementById("clear");
clear.addEventListener("click", clearInput);
// 初始化显示当前日期和时间
function initCurrentDateTime() {
  const currentDate = new Date();
  const yearCurrent = currentDate.getFullYear();
  const monthCurrent = currentDate.getMonth() + 1; // 月份从 0 到 11
  const dayCurrent = currentDate.getDate();
  const hoursCurrent = currentDate.getHours();
  const minutesCurrent = currentDate.getMinutes();
  const secondsCurrent = currentDate.getSeconds();

  y.placeholder = yearCurrent;
  month.placeholder = monthCurrent;
  d.placeholder = dayCurrent;
  h.placeholder = hoursCurrent;
  minute.placeholder = minutesCurrent;
  s.placeholder = secondsCurrent;
  tz.placeholder = -currentDate.getTimezoneOffset() / 60;
}

// 页面加载时初始化当前日期和时间
initCurrentDateTime();
updateTime();

function updateTime() {
  const yearForCal = y.value ? y.value : y.placeholder;
  const monthForCal = month.value ? month.value - 1 : month.placeholder - 1;
  const dayForCal = d.value ? d.value : d.placeholder;
  const hourForCal = h.value ? h.value : h.placeholder;
  const minuteForCal = minute.value ? minute.value : minute.placeholder;
  const secondForCal = s.value ? s.value : s.placeholder;
  const timeZoneForCal = tz.value ? tz.value : tz.placeholder;
  const date = new Date(
    Date.UTC(
      yearForCal,
      monthForCal,
      dayForCal,
      hourForCal,
      minuteForCal,
      secondForCal
    )
  );
  // console.log(date);
  date.setUTCFullYear(yearForCal);
  date.setUTCHours(date.getUTCHours() - timeZoneForCal);
  const astroTime = new Astronomy.AstroTime(date);
  // console.log(astroTime);
  utInput.value = (astroTime.ut + 2451545.0).toFixed(6);
  ttInput.value = (astroTime.tt + 2451545.0).toFixed(6);
  tsInput.value = +date;
  tssInput.value = Math.floor(date / 1000);
}

function updateTimeFromTT() {
  const astroTime = Astronomy.AstroTime.FromTerrestrialTime(
    Number(tt.value) - 2451545.0
  );
  const dateNew = astroTime.date;
  y.value = dateNew.getUTCFullYear();
  month.value = dateNew.getUTCMonth() + 1;
  d.value = dateNew.getUTCDate();
  h.value = dateNew.getUTCHours();
  minute.value = dateNew.getUTCMinutes();
  s.value = dateNew.getUTCSeconds();
  tz.value = 0;
  ut.value = astroTime.ut + 2451545.0;
  tt.value = astroTime.tt + 2451545.0;
  ts.value = +dateNew;
  tss.value = Math.floor(+dateNew / 1000);
}

function updateTimeFromUT() {
  const astroTime = new Astronomy.AstroTime(Number(ut.value) - 2451545.0);
  const dateNew = astroTime.date;

  y.value = dateNew.getUTCFullYear();
  month.value = dateNew.getUTCMonth() + 1;
  d.value = dateNew.getUTCDate();
  h.value = dateNew.getUTCHours();
  minute.value = dateNew.getUTCMinutes();
  s.value = dateNew.getUTCSeconds();
  tz.value = 0;
  ut.value = astroTime.ut + 2451545.0;
  tt.value = astroTime.tt + 2451545.0;
  ts.value = +dateNew;
  tss.value = Math.floor(+dateNew / 1000);
}

function updateTimeFromTS() {
  const dateNew = new Date(Number(ts.value));
  const astroTime = new Astronomy.AstroTime(dateNew);
  y.value = dateNew.getUTCFullYear();
  month.value = dateNew.getUTCMonth() + 1;
  d.value = dateNew.getUTCDate();
  h.value = dateNew.getUTCHours();
  minute.value = dateNew.getUTCMinutes();
  s.value = dateNew.getUTCSeconds();
  tz.value = 0;
  ut.value = astroTime.ut + 2451545.0;
  tt.value = astroTime.tt + 2451545.0;
  tss.value = Math.floor(ts.value / 1000);
}
function updateTimeFromTSSec() {
  const dateNew = new Date(Number(tss.value) * 1000);
  const astroTime = new Astronomy.AstroTime(dateNew);
  y.value = dateNew.getUTCFullYear();
  month.value = dateNew.getUTCMonth() + 1;
  d.value = dateNew.getUTCDate();
  h.value = dateNew.getUTCHours();
  minute.value = dateNew.getUTCMinutes();
  s.value = dateNew.getUTCSeconds();
  tz.value = 0;
  ut.value = astroTime.ut + 2451545.0;
  tt.value = astroTime.tt + 2451545.0;
  ts.value = Number(tss.value) * 1000;
}
//logic about the date and time input
const nextThreshold = [1680, 2, 4, 3, 6, 6];
const maxValue = [16800, 12, 31, 24, 59, 59];
const minValue = [-13000, 1, 1, 0, 0, 0];

const dateTime = document.querySelectorAll(".form-group .input-number");

dateTime.forEach((input, idx) => {
  input.addEventListener("keydown", (e) => {
    //set back and left change to the left input
    if (
      idx > 0 &&
      ((e.key === "Backspace" &&
        (input.value.length === 1 || input.value.length === 0)) ||
        (idx > 0 && e.key === "ArrowLeft" && input.value.length === 0))
    ) {
      setTimeout(() => dateTime[idx - 1].focus(), 10);
    } else if (idx < 6 && e.key === "ArrowRight" && input.value.length === 0) {
      setTimeout(() => dateTime[idx + 1].focus(), 10);
    }
  });
  input.addEventListener("input", (e) => {
    if (idx < 6 && e.target.value >= nextThreshold[idx]) {
      setTimeout(() => dateTime[idx + 1].focus(), 10);
    } else if (idx === 0 && e.target.value.length >= 5) {
      setTimeout(() => dateTime[idx + 1].focus(), 10);
    }
  });
});
