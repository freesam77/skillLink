const express = require("express"),
  mongoose = require("mongoose"),
//   db = require("./config/keys").mongoURI,
  dotenv = require("dotenv").config()

const users = require("./routes/api/users"),
  profile = require("./routes/api/profile"),
  posts = require("./routes/api/posts");

const app = express();

const url = process.env.MONGODB_URI
console.log("url is:", url)

mongoose
  .connect(url)
  .then(() => console.log("mongoDB is connected"))
  .catch(err => {
    console.log(err);
  });

app.get("/", (req, res) => res.send("Hello World"));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
