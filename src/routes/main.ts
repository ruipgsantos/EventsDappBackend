import express from "express";
const router = express.Router();

type LoginParams = {
  address: string;
  message: string;
  signature: string;
};

// router.post("/login", function (req: Request
//   <LoginParams, Event[], {}, SpaceParams>, res, next) {
//   res.send("respond with a resource");
// });

module.exports = router;
