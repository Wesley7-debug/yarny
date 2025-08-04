import cloudinary from "../cloudinary/Cloudinary.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getorcreateMessage = async (req, res) => {
  const currentUserId = req.user.id || req.user._id;
  const { id: receiverId } = req.params;

  if (!receiverId) {
    return res.status(400).json({ message: "Other user ID is required" });
  }

  try {
    // 1. Try to find existing conversation between two users (not a group)
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [currentUserId, otherUserId], $size: 2 },
    });

    // 2. If not found, create new conversation
    if (!conversation) {
      conversation = new Conversation({
        isGroup: false,
        participants: [currentUserId, otherUserId],
      });
      await conversation.save();
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Error finding or creating conversation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { id: conversationId } = req.params;
  const senderId = req.user.id || req.user._id;
  const { text, image } = req.body;

  if (!conversationId || (!text && !image)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const updatedUrl = await cloudinary.uploader.upload(image);

    const newMessage = new Message({
      conversationId,
      senderId,
      receiverId: null, // optional for group chat
      text,
      image: updatedUrl.secure_url || null,
    });

    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editMessage = async (req, res) => {
  const { id: messageId } = req.params;
  const senderId = req.user.id || req.user._id;
  const { text } = req.body;

  if (!messageId || !text)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== senderId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own messages" });
    }

    message.text = text || message.text;

    await message.save();

    return res.status(200).json(message);
  } catch (error) {
    console.error("Error editing message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  const { id: messageId } = req.params;
  const senderId = req.user.id || req.user._id;

  if (!messageId) {
    return res.status(400).json({ message: "Message ID is required" });
  }

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== senderId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
