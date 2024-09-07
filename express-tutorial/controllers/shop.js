const db = require("../utils/database");

exports.getProducts = async (req, res) => {
  const [result] = await db.query("select * from products");
  res.send(result);
};

exports.createNewProduct = async (req, res) => {
  const { title, price, imageUrl, description } = req.body;

  const [result] = await db.query(
    "insert into products(title, price, imageUrl, description, sellerId) values(?)",
    [[title, price, imageUrl, description, req.user.id]]
  );

  res.send(result);
};

exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  const [result] = await db.query("select * from products where id = ?", [
    productId,
  ]);

  res.send(result[0]);
};

exports.updateProductById = async (req, res) => {
  const { title, description, price, imageUrl } = req.body;
  const { productId } = req.params;

  const [result] = await db.query("update products set ? where id = ?", [
    { title, description, price, imageUrl },
    productId,
  ]);

  res.send(result);
};

exports.deleteProductById = async (req, res) => {
  const { productId } = req.params;

  const [result] = await db.query("delete from products where id = ?", [
    productId,
  ]);

  res.send(result);
};
