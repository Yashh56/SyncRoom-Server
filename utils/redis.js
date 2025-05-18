import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 16501,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export default redisClient;
