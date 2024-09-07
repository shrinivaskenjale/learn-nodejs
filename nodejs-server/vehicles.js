const fs = require("fs");
const path = require("path");

const vehiclesData = fs.readFileSync(path.join(__dirname, "data.json"), {
  encoding: "utf8",
});
exports.vehicles = JSON.parse(vehiclesData);
