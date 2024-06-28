const express = require("express");
const rateLimit = require("../utils/rateLimiter");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

router.get(
  "/route1",
  rateLimit({
    windowSizeInSeconds: 60,
    maxRequests: 5,
  }),
  (req, res) => {
    res.send("Route 1 with rate limiting (5 requests per minute).");
  }
);

router.get(
  "/",
  rateLimit({
    windowSizeInSeconds: 60,
    maxRequests: 2,
  }),
  getUsers
);

router.get(
  "/route2",
  rateLimit({
    windowSizeInSeconds: 60,
    maxRequests: 15,
  }),
  (req, res) => {
    res.send("Route 2 with rate limiting (15 requests per minute).");
  }
);

module.exports = router;
