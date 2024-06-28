const { createClient } = require("redis");

const rateLimit = (options) => {
  const { windowSizeInSeconds, maxRequests } = options;
  const client = createClient();

  client.on("error", (err) => {
    console.error("Redis error in middleware:", err);
  });

  let isConnected = false;
  const connectClient = async () => {
    if (!isConnected) {
      await client.connect();
      isConnected = true;
    }
  };

  return async (req, res, next) => {
    await connectClient();

    const userIp = req.ip;
    const routePath = req.route.path;
    const combinedIdentifier = `${userIp}:${routePath}`;

    try {
      const pipeline = client.multi();
      pipeline.incr(combinedIdentifier);
      pipeline.expire(combinedIdentifier, windowSizeInSeconds);
      const replies = await pipeline.exec();

      const requestCount = replies[0];
      if (requestCount > maxRequests) {
        res
          .status(429)
          .send(
            `Rate limit exceeded. Try again in ${windowSizeInSeconds} seconds.`
          );
      } else {
        next();
      }
    } catch (err) {
      console.error("Redis error in middleware:", err);
      res.status(500).send("Server error");
    }
  };
};

module.exports = rateLimit;
