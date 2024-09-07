const express = require("express");

const path = require("path");

const router = express.Router();

router.use((req, res, next) => {
  // You can add custom properties on request object.
  req.requestTime = new Date();
  next();
});

router.get("/", (req, res) => {
  const responseText = `
    <h1>Hello World!</h1>
    <p>Requested at: ${req.requestTime}</p>
    `;

  // String responses are treated as HTML by default.
  res.send(responseText);
});

// Sending file just for demo.
// It is better to serve files statically if there is no logic involved to decide which file to send.
router.get("/new-product", (req, res) => {
  const options = {
    root: path.join(__dirname, "..", "public"),
  };
  res.sendFile("new-product.html", options, (err) => {
    if (err) {
      next(err);
    } else {
      console.log("File sent");
    }
  });
});

router.post("/new-product", (req, res) => {
  const { product } = req.body;
  fs.writeFile("../learn-log/products.txt", `${product}\n`, { flag: "a" });
  res.redirect("/");
});

// Dynamic routes
// Dynamic segments should start with colon (:).
router.get("/products/:productId", (req, res) => {
  // req.params => path parameters
  // req.query => query parameters

  const { productId } = req.params;
  console.log(req.query);

  res.send({
    productId: productId,
    query: req.query,
  });
});

module.exports = router;
