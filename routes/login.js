// routes/login.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { getAuthUser } = require("../authdb.js");

const router = express.Router();

router.post("/", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  let authUser = getAuthUser(username);

  if (authUser && authUser.password == password) {
    const token = jwt.sign({ username: username }, "my_secret_key", {
      expiresIn: "3h",
    });

    return res.json({
      username: username,
      access_token: token,
      token_type: "Bearer",
      expires_in: "3h",
    });
  } else {
    res.status(401).json({ error: "Login failed" });
  }
});

module.exports = router;
