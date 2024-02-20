// // const MiscSettings = ["colorElements", "homeLocation"];

// import { useAtom } from "jotai";
// import { atomWithStorage } from "jotai/utils";
// // 宫神星 color: water is green (corresponds to wood of five elements in Chinese culture)
// // air is blue (corresponds to water of five elements in Chinese culture)
// const colorGong = {
//   colorFire: " #cc0000", //red
//   colorEarth: "#f1c232", // yellow
//   colorAir: "#3d85c6", // blue
//   colorWater: "#6aa84f", //green
// };
// // Astro.com color: water is blue
// // air is yellow, earth is green,
// const colorAstro = {
//   colorFire: " #cc0000", //red
//   colorEarth: "#6aa84f", //green
//   colorAir: "#f1c232", //yellow
//   colorWater: "#3d85c6", //blue
// };
// // 测测 and Aizhanxing color: water is blue
// // air is green, earth is yellow
// const colorCece = {
//   colorFire: " #cc0000", //red
//   colorEarth: "#f1c232",
//   colorAir: "#6aa84f",
//   colorWater: "#3d85c6",
// };
// // another popular one: astro gold / solar fire's default:
// // water is blue, air is cyan, earth is silver, similar to astro.com
// // didn't provide, since silver is not good to display. This one is good when planets' doesn't follow elements' colors.
// export const colorsAtom = atomWithStorage("colorElements", colorGong);
// export default function ColorSelection() {
//   const [colors, setColors] = useAtom(colorsAtom);
//   return <></>;
// }
