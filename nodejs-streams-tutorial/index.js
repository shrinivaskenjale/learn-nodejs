const fs = require("fs");
const http = require("http");

// We want to read a large file and send it as a response to client.

const server = http.createServer((req, res) => {
  /* 
    ===============
    Solution 1
    ===============
    Problem:
     Whole file has to be read in the memory before we send the response.
    */
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     res.end(data);
  //   });
  /* 
    ===============
    Solution 2 
    ===============
    We create readable stream to read data from file.
    Since http response is a writable stream, we write data read from file on response.

    Problem:
    	readable stream, the one that we're using to read the file from the disk, is much much faster than actually sending the result with the response writable stream over the network. And this will overwhelm the response stream, which cannot handle all this incoming data so fast. And this problem is called backpressure. And it's a real problem that can happen in real situations. 
        
        So in this case, backpressure happens when the response cannot send the data nearly as fast as it is receiving it.

    */
  //   const readable = fs.createReadStream("test-file.txt");
  //   // Streams inherit EventEmitter class so they can emit events.
  //   // Readable streams emit 'data' event when new piece of data is availble to read.
  //   readable.on("data", (chunk) => {
  //     // write() method on writable streams writes data on the stream.
  //     res.write(chunk);
  //   });
  //   //   Readable streams emit 'end' event when it finishes.
  //   readable.on("end", () => {
  //     // end() method on writable streams signals that no more data will be written to the stream.
  //     res.end();
  //   });
  //   readable.on("error", (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end("File not found");
  //   });
  /*
    ===============
    Solution 3
    ===============
    We fix the backpressure problem using pipe() method available on readable streams. This method allows us to provide the output of the readable stream as input to the writable stream.
    It keeps reading and writing in sync.
*/
  const readable = fs.createReadStream("test-file.txt");
  //   readableSrc.pipe(writableDest)
  readable.pipe(res);
  //   By default, stream.end() is called on the destination Writable stream when the source Readable stream emits 'end', so that the destination is no longer writable.
});

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
