const http = require("http");
const fs = require("fs");

// req is a readable stream
// res is a writable stream
const server = http.createServer((req, res) => {
  if (req.url !== "/") {
    return res.end();
  }

  //   =======================
  //   Downloading large file
  //   =======================

  //   Bad way
  //   For each user requesting data from the file, whole file will be loaded into the memory. Within few parallel requests our memory will run out. Check system monitor of your OS for node process.
  //   const data = fs.readFileSync("sample.txt");
  //   res.end(data);

  //   Good way (streams)
  //   const readableStream = fs.createReadStream("sample.txt");
  //   readableStream => writableStream
  //   readableStream.pipe(res);

  //   =======================
  //   Copying large file
  //   =======================

  //   Bad way
  //   const data = fs.readFileSync("sample.txt");
  //   fs.writeFileSync("sample-copy.txt", data);
  //   res.end();

  //   Good way
  //   const readStream = fs.createReadStream("sample.txt");
  //   const writeStream = fs.createWriteStream("sample-copy.txt");
  //   Streams inherit EventEmitter class.
  //   readStream.on("data", (chunk) => {
  //     writeStream.write(chunk);
  //   });
  //   res.end();
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} ✅`);
});
