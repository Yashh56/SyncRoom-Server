import { mongo } from "../utils/db.js";
import redisClient from "../utils/redis.js";

export async function saveMessagesToDB({
  senderId,
  text,
  chatId,
  messageType,
  senderAvatar,
  senderName,
}) {
  const message = await mongo.message.create({
    data: {
      chatId,
      senderId,
      messageType,
      content: text,
      senderAvatar,
      senderName,
      createdAt: new Date(), // Optional if Prisma schema already handles it
    },
  });

  // Notify other subscribers via Redis Pub/Sub
  await redisClient.publish("messages", JSON.stringify({ chatId, message }));

  return message;
}

export async function getMessagesFromDB(chatId, limit) {
  // const cacheKey = `messages:${chatId}`;
  // const cachedMessages = await redisClient.get(cacheKey);

  // if (cachedMessages) {
  //   return JSON.parse(cachedMessages);
  // }

  const messages = await mongo.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  // await redisClient.set(cacheKey, JSON.stringify(messages), {
  //   EX: 3600, // 1 hour
  // });
  // console.log(messages, "messages from db");

  return messages.reverse(); // optional: reverse to show oldest -> newest
}
