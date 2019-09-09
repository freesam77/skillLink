const express = require("express"),
  User = require("../../models/User"),
  gravatar = require("gravatar"),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  passport = require("passport")

const router = express.Router();

// @route   GET api/users/register
// @desc    Register users route
// @access  Public

router.get("/register", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // if error, then throws a readable error
  if (user) {
    res.status(400).json({ email: "This email already exists!" });
  } else {
    // Gravatar API
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
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        try {
          newUser.password = hash;
          const user = await newUser.save(); // mongoose command to save into the database
          return res.json(user);
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
});

// @route   GET api/users/login
// @desc    Login users route
// @access  Public

router.post("/login", async (req, res) => {
  const email = req.body.email,
    password = req.body.password;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "This user doesn't exist." });
  }

  bcrypt.compare(password, user.password).then(isMatch => {
    // returns true or false value
    if (isMatch) {
    //   res.json({ msg: "Successfully logged in!" });
        //   Matched User
      const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
      }
    //   Store the matched user data to json web token
      jwt.sign(payload, process.env.JWT_KEYS,{expiresIn: 3600}, (err, token) => {
          if (err) throw err
        res.json({success: true, token: 'Bearer ' + token})
      })
    } else {
      return res.status(400).json({ password: "Password does not match." });
    }
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

router.get("/current", passport.authenticate('jwt', {session: false}), async (req,res) => {
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email
    })
})

module.exports = router;
