const fs = require("fs");
const path = require("path");

// We load template only once because it stays same all the time. So there is no problem if it is synchronous.
// There is no point in loading templates on each request. So we are reading templates in memory in top-level code.
exports.singleVehicleTemplate = fs.readFileSync(
  path.join(__dirname, "templates", "vehicle.html"),
  { encoding: "utf8" }
);

exports.singleVehiclePageTemplate = fs.readFileSync(
  path.join(__dirname, "templates", "vehiclePage.html"),
  { encoding: "utf8" }
);

exports.vehiclesPageTemplate = fs.readFileSync(
  path.join(__dirname, "templates", "vehiclesPage.html"),
  { encoding: "utf8" }
);
