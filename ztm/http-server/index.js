const http = require("http");

const PORT = 3000;

// req is readable stream
// res is writable stream
const server = http.createServer((req, res) => {
  // res.writeHead(200, {
  //     "content-type": "text/plain",
  // });
  // res.end("Hello world!");

  res.writeHead(200, {
    "content-type": "application/json",
  });
  res.end(JSON.stringify({ id: 1, name: "Shrinivas Kenjale" }));
});

// By default server will listen for requests on our local machine which does not have a domain like google.com.
// 127.0.0.1 => localhost
// We need port to specify where we are listening the requests on our local machine as there are many applications/servers running.
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ✅`);
});
