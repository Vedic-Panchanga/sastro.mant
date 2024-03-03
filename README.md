# About

Serverless astrology web page using [Swiss Ephemeris](https://www.astro.com/swisseph), with help of WebAssembly from [project of u-blusky](https://github.com/u-blusky/sweph-wasm).

1. Chart spanning from -4800 to 3000 CE, displaying positions of planets and some fixed stars.
2. Comparison of solar arc, secondary progression, and transit charts with the natal chart.
3. Vedic chart featuring Dasas and Karakamsa.
4. Bazi and fundamental related information.
5. Simple astrology calendar.
6. Since it is browser based, old machine and slow Internet might have problem when using it.

## Structure

1. root (which is Root.tsx)
   hold and parse general datetime and locations to routes
2. routes (like Chart.tsx): calculate.
   call functions to get the data from wasm.
3. prepare (like ChartDrawingWrapper.tsx): combine data and settings
   cleanup the raw data with settings
4. draw (like SVG.tsx): draw with SVG
