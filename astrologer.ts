// type workerParams:{
//     "number",
//     "number",
//     "number",
//     "number",
//     "number",
//     "string",
//     "number",
//     "number",
// }
export default function astrologer(
  tjd_ut: number,
  sid: number,
  lon: number,
  lat: number,
  height: number,
  iHouse: string,
  flag: number,
  type: number
): Promise<any> {
  return new Promise((resolve, reject) => {
    const astrologer = new Worker("asweph.js");
    astrologer.postMessage([tjd_ut, sid, lon, lat, height, iHouse, flag, type]);
    astrologer.onmessage = function (response) {
      resolve(JSON.parse(response.data));
      astrologer.terminate(); // Clean up the worker after receiving the result
    };
    astrologer.onerror = function (error) {
      reject(error);
      astrologer.terminate(); // Clean up the worker if there's an error
    };
  });
}
