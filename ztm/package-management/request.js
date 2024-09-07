const axios = require("axios");

axios
  .get("https://www.google.com")
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(1);
  })
  .catch((err) => {
    console.log(2);
  })
  .then(() => {
    console.log("All done!");
  });
