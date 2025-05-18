import {
  allChatsById,
  joinChat,
  oneOnOneChat,
  startChat,
} from "./chat.services.js";

export const createChatHandler = async (req, res) => {
  const { isGroup, participants, roomId } = req.body;

  try {
    const chat = await startChat(isGroup, participants, roomId);
    if (!chat) {
      return res.status(400).json({
        status: "error",
        message: "Chat creation failed",
      });
    }
    console.log(chat);
    return res.status(200).json({
      status: "success",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const allChatsByIdHandler = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chat = await allChatsById(roomId);
    return res.status(200).json({
      status: "success",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const oneOnOneChatHandler = async (req, res) => {
  const { currentUserId, otherUserId } = req.params;

  try {
    const chat = await oneOnOneChat(currentUserId, otherUserId);
    return res.status(200).json({
      status: "success",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const joinChatHandler = async (req, res) => {
  const { chatId } = req.body;
  const userId = req.user.id;
  try {
    const chat = await joinChat(chatId, userId);
    if (!chat) {
      return res.status(400).json({
        status: "error",
        message: "Chat join failed",
      });
    }
    return res.status(200).json({
      status: "success",
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
