import Call from "../models/call.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const doCall = async (req, res) => {
  try {
    const { toUserId, toName, peerId, remotePeerId } = req.body;
    const call = new Call({
      from: req.user._id,
      participants: [toUserId],
    });
    const dbCall = await call.save();
    const toUserSocketId = getReceiverSocketId(toUserId);
    const payload = {
      fromUserId: req.user._id,
      fromName: req.user.name,
      toUserId,
      toName,
      remotePeerId,
      peerId,
      callId: dbCall._id,
    };
    console.log(payload);
    io.to(toUserSocketId).emit("video-call", payload);
    res.json(dbCall);
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json(error.message);
  }
};

const rejectCall = async (req, res) => {
  try {
    const { cutTo } = req.body;

    console.log(cutTo);
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

export default { doCall, rejectCall };
