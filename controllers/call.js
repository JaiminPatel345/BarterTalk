import Call from "../models/call.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { v4 as uuidv4 } from "uuid";

const doCall = async (req, res) => {
  try {
    const { toUserId, toName } = req.body;
    const peerId = uuidv4();
    const remotePeerId = uuidv4();

    const call = new Call({
      from: req.user._id,
      participants: [toUserId],
    });
    const dbCall = await call.save();
    const toUserSocketId = getReceiverSocketId(toUserId);

    const callMessage = new Message({
      senderId: req.user._id,
      receiverId: toUserId,
      message: JSON.stringify(dbCall),
      isVideoCall: true,
    });
    const dbCallMessage = await callMessage.save();
    const payload = {
      fromUserId: req.user._id,
      fromName: req.user.name,
      toUserId,
      toName,
      peerId: remotePeerId,
      remotePeerId: peerId,
      callId: dbCall._id,
      messageId: dbCallMessage._id,
    };
    io.to(toUserSocketId).emit("video-call", payload);
    const conversation = await Conversation.findOne({
      participants: { $all: [toUserId, req.user._id] },
    });

    conversation.messages.push(dbCallMessage);
    await conversation.save();

    res.json({ dbCallMessage, peerId, remotePeerId });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json(error.message);
  }
};

const rejectCall = async (req, res) => {
  try {
    const { cutTo } = req.body;

    const toUserSocketId = getReceiverSocketId(cutTo);
    io.to(toUserSocketId).emit("call-rejected");
    res.json({ message: "Call cut successfully", cutBy: req.user });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json(error.message || "Failed to reject call");
  }
};

const acceptedCall = async (req, res) => {
  try {
    const { callId, messageId } = req.body;

    const newCall = await Call.findByIdAndUpdate(
      callId,
      { isAnswer: true },
      { new: true },
    );

    // Add await here and use lean() to get a plain JavaScript object
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { message: JSON.stringify(newCall.toObject()) }, // Convert mongoose doc to plain object
      { new: true },
    ).lean();

    res.json({
      message: "Call Answer",
      updatedMessage,
    });
  } catch (error) {
    console.log("Error in acceptedCall:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { doCall, rejectCall, acceptedCall };
