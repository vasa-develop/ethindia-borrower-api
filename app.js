const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");

mongoose.connect(
  "mongodb://ethindia:ethindia2@ds247061.mlab.com:47061/emaily-dev",
  {
    useMongoClient: true
  }, (err) => {
    console.log(err)
  }
);
mongoose.Promise = global.Promise;


app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, './uploads');
  },
  filename: function (req, file, cb) {

    cb(null, new Date().getTime() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {

    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  // dest: 'uploads/',
  storage: storage
  ,
  fileFilter: fileFilter
});
app.use(upload.any())
app.use((req, res, next) => {
  console.log(req.body)


  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {

  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
