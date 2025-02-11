import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverUserId,io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUsers = await UserModel.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filterUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller :-", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages Controller :-", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: recieverId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadRespponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadRespponse.secure_url;
    }
    const newMessages = new MessageModel({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessages.save();

    //   Real time functionality with socket.io
    // receiverId is from params
    const receiverSocketId = getReceiverUserId(recieverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessages);
    }

    res.status(201).json(newMessages);
  } catch (error) {
    console.log("Error in SendMessage Controller:-", error);
    res.status(500).json({ message: "Internal Server  Error" });
  }
};
