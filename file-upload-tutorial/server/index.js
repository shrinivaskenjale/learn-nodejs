// ================
// Imports
// ================
const express = require("express");
const cors = require("cors");
const multer = require("multer");

// ================
// Config
// ================
const port = 5000;
const app = express();

// Simplest option, but stores file with random name and no extension.
// const upload = multer({ dest: "uploads/" });

// Following option allows us to control the file storage.
const storage = multer.diskStorage({
  // If you pass function as value to destination, you need to create the folder manually.
  // Passing the string creates the folder automatically for you.
  destination: "uploads/",
  filename: (req, file, cb) => {
    // Value passed to cb becomes file.filename property.
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

// Use fileFilter option to filter files. (E.g., you can check mimetype starts with 'image' to only allow images for uploading.)
const upload = multer({ storage: storage });
// upload object has single and array methods which are middlewares. These middlewares store the file in memory/disk then add file/files property on req object.

// ================
// Middlewares
// ================
app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});

// file.originalname => File's name on client computer
// file.filename => File's name on server after upload

app.post("/single-upload", upload.single("singleFile"), async (req, res) => {
  console.log(req.file);
  // You can store url of the image in db using req.file.path property.
  // You can store name of the file in db using req.file.filename property.

  res.send({ message: "File uploaded." });
});

app.post(
  "/multiple-uploads",
  upload.array("multipleFiles"),
  async (req, res) => {
    for (const file of req.files) {
      console.log(file);
    }
    res.send({ message: "Files uploaded." });
  }
);

// For multiple uploads with different fields, use following middleware:
// upload.fields([
//   { name: "coverImage", maxCount: 1 },
//   { name: "images", maxCount: 3 },
// ]);

// ================
// Listen
// ================
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Server listening on port ${port}`);
});
