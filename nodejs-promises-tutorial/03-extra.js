const superagent = require("superagent");

// ===============
// Waiting for multiple promises simultaneously
// ===============

const breed = "husky";

async function get3DogPictures() {
  const promise1 = superagent.get(
    `https://dog.ceo/api/breed/${breed}/images/random`
  );
  const promise2 = superagent.get(
    `https://dog.ceo/api/breed/${breed}/images/random`
  );
  const promise3 = superagent.get(
    `https://dog.ceo/api/breed/${breed}/images/random`
  );

  const results = await Promise.all([promise1, promise2, promise3]);

  for (const result of results) {
    console.log(result.body.message);
  }
}

get3DogPictures();
