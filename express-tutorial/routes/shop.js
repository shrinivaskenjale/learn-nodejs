const express = require("express");

const {
  getProducts,
  getProductById,
  createNewProduct,
  deleteProductById,
  updateProductById,
} = require("../controllers/shop");

const router = express.Router();

router.get("/products", getProducts);

router.get("/products/:productId", getProductById);

router.post("/products/new", createNewProduct);

router.delete("/products/:productId", deleteProductById);

router.put("/products/:productId", updateProductById);

module.exports = router;
