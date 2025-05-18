import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import {
  getMessagesFromDB,
  saveMessagesToDB,
} from "../Messages/message.services.js";
import redisClient from "../utils/redis.js";
import { sql } from "../utils/db.js";

const client = new Map();

export function initWebSocketServer() {
  const wss = new WebSocketServer({ noServer: true });
  // 🔁 Create a subscriber instance for Pub/Sub
  const subscriber = redisClient.duplicate();
  subscriber.connect();

  // 🧭 Listen for new messages
  subscriber.subscribe("messages", (rawMessage) => {
    const { chatId, message } = JSON.parse(rawMessage);

    // Broadcast to all connected clients except sender
    for (const [uid, ws] of client.entries()) {
      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            event: "message:received",
            message,
          })
        );
      }
    }
  });

  wss.on("connection", async (ws, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const token = url.searchParams.get("token");
    const roomId = url.searchParams.get("roomId");
    if (!token) return ws.close(4000, "token is required");

    let userId;
    let chatId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;

      const chat = await sql.chat.findUnique({
        where: { roomId },
      });

      if (!chat) {
        return ws.close(4004, "Chat not found");
      }

      const isParticipant = chat.participants.includes(userId); // or use Set
      if (!isParticipant) {
        console.log("❌ User is not a participant of this chat");
        return ws.close(4000, "You are not a participant of this chat");
      }

      chatId = chat.id;
      client.set(userId, ws);
      console.log(`✅ User ${userId} connected`);

      const history = await getMessagesFromDB(chatId, 20);
      ws.send(
        JSON.stringify({
          event: "chat-history",
          messages: history,
        })
      );

      ws.on("message", async (data) => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed.text;
          const senderAvatar = parsed.senderAvatar || null;
          const senderName = parsed.senderName || null;
          let messageType = parsed.messageType || "TEXT"; // ✅ safe reassignment

          console.log(`📩 Message from ${userId}: ${text}`);

          await saveMessagesToDB({
            senderId: userId,
            text,
            chatId,
            messageType,
            senderAvatar,
            senderName,
          });
        } catch (error) {
          console.error("❌ Error parsing message", error);
          ws.send(
            JSON.stringify({
              event: "error",
              message: "Invalid message format",
            })
          );
        }
      });

      ws.on("close", () => {
        client.delete(userId);
        console.log(`❎ User ${userId} disconnected`);
      });
    } catch (err) {
      console.error("❌ Invalid token", err);
      return ws.close(4000, "Invalid token");
    }
  });

  console.log("🟢 WebSocket server initialized");
  return wss;
}
