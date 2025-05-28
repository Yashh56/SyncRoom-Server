import { sql } from "../utils/db.js";

export async function createMaterial(
  roomId,
  userId,
  title,
  description,
  dueDate,
  attachmentUrl
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

  const roomMember = room.members.find((m) => m.userId === userId);

  if (roomMember.role !== "ADMIN" && roomMember.role !== "MODERATOR") {
    throw new Error("You are not authorized to create materials in this room");
  }

  const material = await sql.material.create({
    data: {
      title: title,
      description: description,
      dueDate: dueDate,
      attachmentUrl: attachmentUrl,
      roomId: roomId,
    },
  });
  return material;
}

export async function getMaterials(roomId) {
  const materials = await sql.material.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return materials;
}

export async function updateMaterial(
  materialId,
  userId,
  title,
  description,
  dueDate,
  attachmentUrl
) {
  const material = await sql.material.findUnique({
    where: {
      id: materialId,
    },
    include: {
      room: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!material) throw new Error("Material not found");

  const roomMember = material.room.members.find((m) => m.userId === userId);

  if (roomMember.role !== "ADMIN" && roomMember.role !== "MODERATOR") {
    throw new Error("You are not authorized to update this material");
  }

  const updatedMaterial = await sql.material.update({
    where: {
      id: materialId,
    },
    data: {
      title: title,
      description: description,
      dueDate: dueDate,
      attachmentUrl: attachmentUrl,
    },
  });

  return updatedMaterial;
}
export async function deleteMaterial(materialId, userId) {
  const material = await sql.material.findUnique({
    where: {
      id: materialId,
    },
    include: {
      room: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!material) throw new Error("Material not found");

  const roomMember = material.room.members.find((m) => m.userId === userId);

  if (roomMember.role !== "ADMIN" && roomMember.role !== "MODERATOR") {
    throw new Error("You are not authorized to delete this material");
  }

  await sql.material.delete({
    where: {
      id: materialId,
    },
  });

  return { message: "Material deleted successfully" };
}

