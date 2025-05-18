import { mongo, sql } from "../utils/db.js";

export async function startChat(isGroup, participants, roomId) {
  // if (!Array.isArray(participants) || participants.length < 2) {
  //   throw new Error("Participants must be an array with at least two members.");
  // }

  const chat = await sql.chat.create({
    data: {
      isGroup,
      participants,
      roomId: roomId || null,
    },
  });
  console.log(chat);
  return chat;
}

export async function allChatsById(roomId) {
  const chat = await sql.chat.findMany({
    where: {
      roomId,
    },
  });
  return chat;
}

export async function oneOnOneChat(currentUserId, otherUserId) {
  const chat = await sql.chat.findFirst({
    where: {
      isGroup: false,
      participants: {
        hasEvery: [otherUserId, currentUserId],
      },
    },
  });
  if (!chat) {
    throw new Error("No chat found");
  }
  return chat;
}

export async function joinChat(roomId, userId) {
  const chat = await sql.chat.update({
    where: {
      roomId: roomId,
    },
    data: {
      participants: {
        push: userId,
      },
    },
  });
  return chat;
}
