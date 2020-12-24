// import express, routes, logger
const express = require("express");
const logger = require("morgan");
const movies = require("./routes/movies");
const users = require("./routes/users");
const bodyParser = require("body-parser");
const mongoose = require("./config/database"); //database configuration
var jwt = require("jsonwebtoken");
const app = express();
//multer
const multer = require("multer");
// In disk stroage Image store using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });
app.set("secretKey", "nodeRestApi"); // jwt secret token
// connection to mongodb
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
// upload a image using multer
app.post("/profile", upload.single("avatar"), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.json({
    status: "success",
    message: "Image Upload!!!",
    data: {
      profile: req.file,
    },
  });
});
// public route
app.use("/users", users);
// private route
app.use("/movies", validateUser, movies);

// jwt - validate user function
function validateUser(req, res, next) {
  jwt.verify(
    req.headers["x-access-token"],
    req.app.get("secretKey"),
    function (err, decoded) {
      if (err) {
        res.json({ status: "error", message: err.message, data: null });
      } else {
        // add user id to request
        req.body.userId = decoded.id;
        next();
      }
    }
  );
}

// express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
// handle 404 error
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// handle errors
app.use(function (err, req, res, next) {
  console.log("error", err);
  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else res.status(500).json({ message: err.message });
});

app.listen(3000, function () {
  console.log("Node server listening on port 3000");
});
