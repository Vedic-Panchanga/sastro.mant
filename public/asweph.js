let flag = false;
self.Module = {
  locateFile: function (s) {
    return s;
  },
  // Add this function
  onRuntimeInitialized: function () {
    var query = get();
    flag = true;
    postMessage(query);
  },
};

self.importScripts("astro.js");

self.data = {};

// to pass data from the main JS file
self.onmessage = function (messageEvent) {
  self.data = messageEvent.data; // save the data
  if (flag) {
    var query = get();
    postMessage(query);
  }
};

// gets executed when everything is ready.
self.get = function () {
  const calc = self.Module.ccall(
    "get",
    "string",
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "string",
      "number",
      "number",
    ],
    [
      self.data[0],
      self.data[1],
      self.data[2],
      self.data[3],
      self.data[4],
      self.data[5],
      self.data[6],
      self.data[7],
    ]
  );
  return calc;
};
