const { Readable, Writable } = require("stream");

// Creation of readable stream
const readableStream = new Readable({
  read() {},
  //   In bytes
  highWaterMark: 2,
});

// Creation of writable stream
const writableStream = new Writable({
  write(s) {
    console.log(`📝 Writing ${s}`);
  },
});

readableStream.on("data", (chunk) => {
  console.log(`🚀 ${chunk}`);
  writableStream.write(chunk);
});

// Push the data into readable stream.
console.log(readableStream.push("Hello world!"));
