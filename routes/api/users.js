const express = require("express"),
  User = require("../../models/User"),
  gravatar = require("gravatar"),
  bcrypt = require("bcryptjs");

const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.get("/test", (req, res) => {
  res.json({ msg: "Users api works!" });
});

// @route   GET api/users/register
// @desc    Register users route
// @access  Public

router.get("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    // if error, then throws a readable error
    if (user) {
      res.status(400).json({ email: "This email already exists!" });
    } else {
      // assign avatar if exists
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating, can be 'pg' or 'r'-rated to include nudity and other stuffs
        d: "mm" // Default
      });

      // create User
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      // Salt the hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save() // mongoose command to save into the database
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
