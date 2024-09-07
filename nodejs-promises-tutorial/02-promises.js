// https://dog.ceo/dog-api/

const fs = require("fs");
const superagent = require("superagent");

// ===============
// Writing promises
// ===============

function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject("File not found.");
      }

      resolve(data);
    });
  });
}

function writeFilePromise(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject("Write failed.");
      }
      resolve("Write succeeded.");
    });
  });
}

// ===============
// Consuming promises
// ===============

/*
readFilePromise("dog.txt")
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePromise("dog-img.txt", res.body.message);
  })
  .then(() => {
    console.log("Image saved to file");
  })
  .catch((err) => {
    console.log(err);
    return;
  });
*/

async function getDogPicture() {
  try {
    const breed = await readFilePromise("dogg.txt");
    console.log(`Breed: ${breed}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${breed}/images/random`
    );
    console.log(res.body.message);
    await writeFilePromise("dog-img.txt", res.body.message);
    console.log("Image saved to file");
    // Returning a value from async function resolves promise and throwing an error from it rejects promise.
    return "Done";
  } catch (error) {
    console.log("Error occured 💥");
    console.log(error);
    return "Failed";
  }
}

// Sometimes you need to consume promise returned by async functions

// 1. Using then-catch
// getDogPicture().then((msg) => {
//   console.log(msg);
// });

// 2. Using IIFE and async await
(async () => {
  try {
    const msg = await getDogPicture();
    console.log(msg);
  } catch (error) {
    console.log(error);
  }
})();
