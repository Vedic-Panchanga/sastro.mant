let astrologerWorker: Worker | null = null;
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
    // if (astrologerWorker) {
    //   astrologerWorker.terminate();
    // }
    if (!astrologerWorker) {
      astrologerWorker = new Worker("asweph.js");
    }

    astrologerWorker.postMessage([
      tjd_ut,
      sid,
      lon,
      lat,
      height,
      iHouse,
      flag,
      type,
    ]);
    astrologerWorker.onmessage = function (response) {
      resolve(JSON.parse(response.data));
      // astrologerWorker.terminate(); // Clean up the worker after receiving the result
    };
    astrologerWorker.onerror = function (error) {
      reject(error);
    };
  });
}
