import { joinChat, startChat } from "../Chats/chat.services.js";
import { mongo, sql } from "../utils/db.js";
import { generateInviteCode } from "../utils/generateInviteCode.js";

export async function createRoom(name, userId, mode, banner) {
  const inviteCode = generateInviteCode();
  console.log(userId);
  const user = await sql.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found");

  console.log("Creating room for user:", userId, "with name:", name);

  const room = await sql.room.create({
    data: {
      name,
      inviteCode,
      banner,
      mode,
      createdBy: userId,
      members: {
        create: {
          userId: userId,
          role: "ADMIN",
        },
      },
    },
    include: {
      members: true,
    },
  });

  const chatResult = await startChat(true, [userId], room.id);

  return {
    ...room,
    chat: chatResult,
  };
}

export async function joinRoom(inviteCode, userId) {
  const room = await sql.room.findUnique({
    where: {
      inviteCode,
    },
    include: {
      members: true,
    },
  });

  if (!room) throw new Error("Room not found");

  const isMember = room.members.find((m) => m.userId === userId);
  if (isMember) throw new Error("Already Joined!");

  await sql.roomMember.create({
    data: {
      userId,
      roomId: room.id,
      role: "USER",
    },
    include: {
      user: true,
    },
  });

  const joinChatResult = await joinChat(room.id, userId);

  return {
    ...room,
    chat: joinChatResult,
  };
}

export async function getRoom(id) {
  const room = await sql.room.findUnique({
    where: {
      id: id,
    },
    include: {
      members: true,
      Materials: true,
      Chat: true,
    },
  });
  if (!room) throw new Error("Room not found");
  return room;
}

export async function leaveRoom(roomId, userId) {
  const room = await sql.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      members: true,
    },
  });

  if (!room) throw new Error("Room not found");
  const isAdmin = room.members.find(
    (m) => m.userId === userId && m.role === "ADMIN"
  );
  if (isAdmin)
    throw new Error(
      "You can't leave the room as an admin, please remove yourself from the admin first"
    );
  const isMember = room.members.find((m) => m.userId === userId);
  if (!isMember) throw new Error("You are not a member of this room");

  await sql.roomMember.delete({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
  });
  return room;
}

export async function deleteRoom(roomId, userId) {
  const room = await sql.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      members: true,
      Materials: true,
    },
  });
  if (!room) throw new Error("Room not found");
  const isAdmin = room.members.find(
    (m) => m.userId === userId && m.role === "ADMIN"
  );
  if (!isAdmin) throw new Error("You are not an admin of this room");

  await sql.roomMember.deleteMany({
    where: {
      roomId,
    },
  });
  await sql.material.deleteMany({
    where: {
      roomId,
    },
  });

  await mongo.chat.deleteMany({
    where: {
      roomId,
    },
  });
  await sql.room.delete({
    where: {
      id: roomId,
    },
  });
  return room;
}

export async function updateRoom(roomId, userId, name) {
  const room = await sql.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      members: true,
    },
  });
  if (!room) throw new Error("Room not found");
  const isAdmin = room.members.find(
    (m) => m.userId === userId && m.role === "ADMIN"
  );
  if (!isAdmin) throw new Error("You are not an admin of this room");
  const updatedRoom = await sql.room.update({
    where: {
      id: roomId,
    },
    data: {
      name,
    },
  });
  return updatedRoom;
}

export async function getAllJoinedRooms(userId) {
  const rooms = await sql.room.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });
  if (!rooms) return [];
  return rooms;
}

export async function getPublicRooms() {
  const rooms = await sql.room.findMany({
    where: {
      mode: "PUBLIC",
    },
  });
  if (!rooms) return [];
  return rooms;
}

export async function getRoomMembers(roomId) {
  const room = await sql.roomMember.findMany({
    where: {
      roomId,
    },
    include: {
      user: true,
    },
  });
  if (!room) throw new Error("Room not found");
  return room;
}
