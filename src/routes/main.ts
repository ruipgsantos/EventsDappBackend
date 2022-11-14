import express from "express";
const router = express.Router();

router.post("/login", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
