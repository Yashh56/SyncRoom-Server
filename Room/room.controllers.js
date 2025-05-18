import {
  createRoom,
  deleteRoom,
  getAllJoinedRooms,
  getPublicRooms,
  getRoom,
  getRoomMembers,
  joinRoom,
  leaveRoom,
  updateRoom,
} from "./room.services.js";

export const createRoomHandler = async (req, res) => {
  const { name, mode, banner } = req.body;
  const userId = req.user.id;
  try {
    const room = await createRoom(name, userId, mode, banner);
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
  const { roomId, userId } = req.body;

  try {
    const room = await leaveRoom(roomId, userId);
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
  const { roomId } = req.params;
  const { userId } = req.body;

  try {
    const room = await deleteRoom(roomId, userId);
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
  const { roomId } = req.params;
  const { name, userId } = req.body;

  try {
    const room = await updateRoom(roomId, name, userId);
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
    const rooms = await getPublicRooms();
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
