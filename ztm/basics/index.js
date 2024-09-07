const mission = process.argv[2];

if (mission === "learn") {
  console.log("It is time to learn Node!");
} else {
  console.log(`Is ${mission} really more fun?`);
}
