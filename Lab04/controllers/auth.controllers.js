const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("../config/passport");
const fs = require("fs");
const validator = require('validator');
const users = []; // store the user info here

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);


const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

const getRegister = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "register.html");
  res.sendFile(filePath);
};

const postRegister = async (req, res, next) => {
  try {
    if (!passwordPattern.test(req.body.password)) {
      console.error("Invalid password format");
      return res.status(400).send("not strong Password")
    }
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      id: Date.now().toString(),
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    users.push(userData);

    const filePath = "./user.json";

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(filePath, "[]", (error) => {
          if (error) {
            console.error("Error creating file:", error);
          } else {
            console.log("File created:", filePath);
          }
        });
      }

      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          console.error("Error reading file:", readErr);
          return res.redirect("/register");
        }

        const existingUserData = JSON.parse(data);
        existingUserData.push(userData);

        fs.writeFile(filePath, JSON.stringify(existingUserData), (writeErr) => {
          if (writeErr) {
            console.error("Error writing file:", writeErr);
          } else {
            console.log("User data saved successfully!!");
            console.log(users); // show the user list
            res.redirect("/login");
          }
        });
      });
    });
  } catch {
    res.redirect("/register");
  }
};

module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
};
