const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/* 
Following line does not work on windows.
Alternatively, you can set environment variable in command line.
*/
// process.env.UV_THREADPOOL_SIZE = 1;

const start = Date.now();

setImmediate(() => {
  console.log("Immediate 1 finished");
});

setTimeout(() => {
  console.log("Timer 1 finished");
}, 0);

fs.readFile(path.join(__dirname, "test-file.txt"), () => {
  console.log("I/O finished");

  setTimeout(() => {
    console.log("Timer 2 finished");
  }, 0);

  setTimeout(() => {
    console.log("Timer 3 finished");
  }, 3000);

  setImmediate(() => {
    console.log("Immediate 2 finished");
  });

  process.nextTick(() => {
    console.log("process.nextTick()");
  });

  /*
  By default, thread pool has 4 threads. So all 4 password encryptions occur with very little time difference.
  But if we set thread pool size to 1 then we can see large difference in time. This is because event loop offloads all 4 operations on only one thread which are executed one after another.

  Try setting thread count to different values to see the difference.
  */

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    const end = Date.now();
    console.log(`Finished encryption 1 after ${end - start}ms`);
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    const end = Date.now();
    console.log(`Finished encryption 2 after ${end - start}ms`);
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    const end = Date.now();
    console.log(`Finished encryption 3 after ${end - start}ms`);
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    const end = Date.now();
    console.log(`Finished encryption 4 after ${end - start}ms`);
  });
});

console.log("Hello from top-level code");

/*
Node application execution sequence:

1. Initialize the program

2. Execute top-level code

3. Require modules

4. Register event callbacks

5. Start the EVENT LOOP!
*/
