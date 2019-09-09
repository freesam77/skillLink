const express = require("express"),
  mongoose = require("mongoose"),
  //   db = require("./config/keys").mongoURI,
  dotenv = require("dotenv").config(),
  bodyParser = require("body-parser"),
  passport = require("passport");

const users = require("./routes/api/users"),
  profile = require("./routes/api/profile"),
  posts = require("./routes/api/posts");

const app = express();

const url = process.env.MONGODB_URI;
console.log("url is:", url);

// DB config
mongoose
  .connect(url)
  .then(() => console.log("mongoDB is connected"))
  .catch(err => {
    console.log(err);
  });

//   Passport Middleware
app.use(passport.initialize());
//   Passport Config
require("./config/passport")(passport);

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
