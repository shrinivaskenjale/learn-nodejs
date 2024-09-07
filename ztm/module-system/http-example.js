const { request, get } = require("http");
// Dynamic import
const numPromise = import("./test.mjs");
numPromise.then((num) => console.log(num));

// Use https module to make request to https url.

// Make http request

// ======================
// Method 1
// ======================
/*
const req = request("http://www.google.com", (res) => {
  // Response emits 'data' event when there is chunk of data. If size of the response is large, multiple 'data' events occur and you get new chunk each time.
  res.on("data", (chunk) => {
    console.log(`Data chunk: ${chunk}`);
  });
  // Response emits 'end' event when there is no more data.
  res.on("end", () => {
    console.log("No more data");
  });
});

// end() method sends the request.
req.end();
*/
// ======================
// Method 2
// ======================

get("http://www.google.com", (res) => {
  // Response emits 'data' event when there is chunk of data. If size of the response is large, multiple 'data' events occur and you get new chunk each time.
  res.on("data", (chunk) => {
    console.log(`Data chunk: ${chunk}`);
  });
  // Response emits 'end' event when there is no more data.
  res.on("end", () => {
    console.log("No more data");
  });
});
// get() method calls req.end() automatically.
