const http = require("http");

// server object inherits EventEmitter class
const server = http.createServer();

// Whenever request comes, server emits 'request' event and gives 2 arguments to event handler.

// Event listener for 'request' event
server.on("request", (req, res) => {
  console.log(`${req.method} request at ${req.url} 🚀`);
  res.end(`${req.method} request at ${req.url}`);
});

// Event listener for 'close' event, emitted when server stops.
server.on("close", () => {
  console.log("Server closed");
});

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
