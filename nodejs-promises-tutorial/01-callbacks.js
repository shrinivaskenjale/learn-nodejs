// https://dog.ceo/dog-api/

const fs = require("fs");
const superagent = require("superagent");

// Callback hell

fs.readFile("dog.txt", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log("Image saved to file");
      });
    });
});
