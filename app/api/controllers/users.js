const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
module.exports = {
  create: function (req, res, next) {
    userModel.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio,
        profileImage: req.body.profileImage,
        isVerified: req.body.isVerified,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExpires: req.body.resetPasswordExpires,
      },
      function (err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "User added successfully!!!",
            data: result,
          });
      }
    );
  },

  authenticate: function (req, res, next) {
    userModel.findOne({ email: req.body.email }, function (err, userInfo) {
      if (err) {
        next(err);
      } else {
        console.log("req", req);
        if (
          userInfo != null &&
          bcrypt.compareSync(req.body.password, userInfo.password)
        ) {
          const token = jwt.sign(
            { id: userInfo._id },
            req.app.get("secretKey"),
            { expiresIn: "24h" }
          );
          res.json({
            status: "success",
            message: "user found!!!",
            data: { user: userInfo, token: token },
          });
          // nodemailer
          let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "dishantch7@gmail.com",
              pass: "Dishant@123",
            },
          });

          let mailDetails = {
            from: "dishantch7@gmail.com",
            to: req.body.email,
            subject: "node-crud",
            text: "Welcome to our application",
          };

          mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
              console.log("Error Occurs");
            } else {
              console.log("email response", data);
              console.log("Email sent successfully");
            }
          });
        } else {
          res.json({
            status: "error",
            message: "Invalid email/password!!!",
            data: null,
          });
        }
      }
    });
  },

  getById: function (req, res, next) {
    console.log(req.body);
    userModel.findById(req.params.userId, function (err, userInfo) {
      if (err) {
        next(err);
      } else {
        res.json({
          status: "success",
          message: "User List found!!!",
          data: { users: userInfo },
        });
      }
    });
  },

  getAll: function (req, res, next) {
    let userList = [];

    userModel.find({}, function (err, users) {
      if (err) {
        next(err);
      } else {
        for (let user of users) {
          userList.push({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.name,
            email: user.email,
          });
        }
        res.json({
          status: "success",
          message: "User list found!!!",
          data: { users: userList },
        });
      }
    });
  },

  updateById: function (req, res, next) {
    userModel.findByIdAndUpdate(
      req.params.userId,
      { firstName: req.body.firstName },
      function (err, userInfo) {
        if (err) next(err);
        else {
          res.json({
            status: "success",
            message: "User updated successfully!!!",
            data: {
              data: { users: userInfo },
            },
          });
        }
      }
    );
  },

  deleteById: function (req, res, next) {
    userModel.findByIdAndRemove(req.params.userId, function (err, userInfo) {
      if (err) next(err);
      else {
        res.json({
          status: "success",
          message: "User deleted successfully!!!",
          data: null,
        });
      }
    });
  },
};
