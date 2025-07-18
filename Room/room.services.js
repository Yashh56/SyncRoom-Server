import { joinChat, startChat } from "../Chats/chat.services.js";
import { mongo, sql } from "../utils/db.js";
import { generateInviteCode } from "../utils/generateInviteCode.js";

export async function createRoom(name, userId, mode, banner, description) {
  const inviteCode = generateInviteCode();
  const user = await sql.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found");
  if (!name || name.trim() === "") throw new Error("Room name is required");

  const room = await sql.room.create({
    data: {
      name,
      inviteCode,
      banner,
      mode,
      description,
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
      members: {
        include: {
          user: true,
        },
      },
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
    where: { id: roomId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      Materials: true,
      Chat: true,
    },
  });

  if (!room) throw new Error("Room not found");

  const isAdmin = room.members.find(
    (m) => m.userId === userId && m.role === "ADMIN"
  );
  if (!isAdmin) throw new Error("You are not an admin of this room");

  // Step 1: Delete related records
  await sql.roomMember.deleteMany({
    where: { roomId },
  });

  await sql.material.deleteMany({
    where: { roomId },
  });

  await sql.chat.deleteMany({
    where: { roomId },
  });

  // Step 2: Delete the room
  const deletedRoom = await sql.room.delete({
    where: { id: roomId },
  });

  return deletedRoom;
}

export async function updateRoom(
  roomId,
  name,
  userId,
  mode,
  banner,
  description
) {
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
      description,
      banner,
      mode,
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
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
  if (!rooms) return [];
  return rooms;
}

export async function getPublicRooms(userId) {
  const rooms = await sql.room.findMany({
    where: {
      mode: "PUBLIC",
      members: {
        none: {
          userId: userId,
        },
      },
    },
  });
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

export async function getRoomByInviteCode(inviteCode) {
  const room = await sql.room.findUnique({
    where: {
      inviteCode: inviteCode,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      Materials: true,
      Chat: true,
    },
  });
  if (!room) throw new Error("Room not found");
  return room;
}
