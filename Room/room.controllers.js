import {
  createRoom,
  deleteRoom,
  getAllJoinedRooms,
  getPublicRooms,
  getRoom,
  getRoomByInviteCode,
  getRoomMembers,
  joinRoom,
  leaveRoom,
  updateRoom,
} from "./room.services.js";

export const createRoomHandler = async (req, res) => {
  const { name, mode, banner, description } = req.body;
  const userId = req.user.id;
  try {
    const room = await createRoom(name, userId, mode, banner, description);
    return res.status(201).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getRoomHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await getRoom(id);
    return res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const joinRoomHandler = async (req, res) => {
  const { inviteCode } = req.body;
  const userId = req.user.id;
  try {
    const room = await joinRoom(inviteCode, userId);
    return res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const leaveRoomHandler = async (req, res) => {
  const { id, userId } = req.body;

  try {
    const room = await leaveRoom(id, userId);
    return res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteRoomHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const room = await deleteRoom(id, userId);
    return res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateRoomHandler = async (req, res) => {
  const { id } = req.params;
  const { name, description, banner, mode } = req.body;
  const userId = req.user.id;

  try {
    const room = await updateRoom(id, name, userId, mode, banner, description);
    return res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAllJoinedRoomsHandler = async (req, res) => {
  const userId = req.user.id;
  try {
    const rooms = await getAllJoinedRooms(userId);
    console.log(rooms);
    if (!rooms) {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }
    return res.status(200).json({
      status: "success",
      data: rooms,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAllPublicRoomsHandler = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await getPublicRooms(userId);
    if (!rooms) {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }
    return res.status(200).json({
      status: "success",
      data: rooms,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getRoomMembersHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const members = await getRoomMembers(id);
    return res.status(200).json({
      status: "success",
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getRoomByInviteCodeHandler = async (req, res) => {
  const { inviteCode } = req.params;
  try {
    const room = await getRoomByInviteCode(inviteCode);
    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}