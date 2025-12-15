import Conversation from "../models/conversation.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members, avatarUrl } = req.body;
    const creatorId = req.user._id;

    const uniqueParticipantIds = Array.from(
      new Set([creatorId.toString(), ...(members || []).map((m) => m.toString())]),
    );

    const conversation = new Conversation({
      participants: uniqueParticipantIds,
      isGroup: true,
      groupName: name,
      groupAvatarUrl: avatarUrl,
      admins: [creatorId],
    });

    const saved = await conversation.save();

    // Notify members they were added
    uniqueParticipantIds
      .filter((p) => p.toString() !== creatorId.toString())
      .forEach((participantId) => {
        const socketId = getReceiverSocketId(participantId.toString());
        if (socketId) io.to(socketId).emit("group-updated", saved);
      });

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const groups = await Conversation.find({
      isGroup: true,
      participants: req.user._id,
    });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addGroupMembers = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const { members } = req.body; // array of userIds
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ message: "Group not found" });

    if (!conversation.admins.find((a) => a.toString() === userId)) {
      return res.status(403).json({ message: "Only admins can add members" });
    }

    const toAdd = (members || []).map((m) => m.toString());
    const existing = new Set(conversation.participants.map((p) => p.toString()));
    toAdd.forEach((m) => existing.add(m));
    conversation.participants = Array.from(existing);
    await conversation.save();

    conversation.participants.forEach((participantId) => {
      const socketId = getReceiverSocketId(participantId.toString());
      if (socketId) io.to(socketId).emit("group-updated", conversation);
    });

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const memberId = req.params.memberId;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ message: "Group not found" });

    if (!conversation.admins.find((a) => a.toString() === userId)) {
      return res.status(403).json({ message: "Only admins can remove members" });
    }

    // Admin can remove anyone including other admins; optional: block removing last admin
    const isLastAdmin =
      conversation.admins.length === 1 &&
      conversation.admins[0].toString() === memberId.toString();
    if (isLastAdmin) {
      return res.status(400).json({ message: "Cannot remove the last admin" });
    }

    conversation.participants = conversation.participants.filter(
      (p) => p.toString() !== memberId.toString(),
    );
    conversation.admins = conversation.admins.filter(
      (a) => a.toString() !== memberId.toString(),
    );
    await conversation.save();

    conversation.participants.forEach((participantId) => {
      const socketId = getReceiverSocketId(participantId.toString());
      if (socketId) io.to(socketId).emit("group-updated", conversation);
    });

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user._id.toString();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ message: "Group not found" });

    const isLastAdmin =
      conversation.admins.length === 1 &&
      conversation.admins[0].toString() === userId.toString();
    if (isLastAdmin && conversation.participants.length > 1) {
      return res.status(400).json({ message: "Transfer admin before leaving" });
    }

    conversation.participants = conversation.participants.filter(
      (p) => p.toString() !== userId,
    );
    conversation.admins = conversation.admins.filter((a) => a.toString() !== userId);
    await conversation.save();

    conversation.participants.forEach((participantId) => {
      const socketId = getReceiverSocketId(participantId.toString());
      if (socketId) io.to(socketId).emit("group-updated", conversation);
    });

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user._id.toString();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ message: "Group not found" });

    if (!conversation.admins.find((a) => a.toString() === userId)) {
      return res.status(403).json({ message: "Only admins can delete group" });
    }
    await conversation.deleteOne();

    // notify members
    conversation.participants.forEach((participantId) => {
      const socketId = getReceiverSocketId(participantId.toString());
      if (socketId) io.to(socketId).emit("group-deleted", { _id: conversationId });
    });
    res.json({ message: "Group deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const setAdmin = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const memberId = req.params.memberId;
    const userId = req.user._id.toString();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ message: "Group not found" });

    if (!conversation.admins.find((a) => a.toString() === userId)) {
      return res.status(403).json({ message: "Only admins can promote" });
    }
    if (!conversation.participants.find((p) => p.toString() === memberId)) {
      return res.status(404).json({ message: "User not in group" });
    }
    if (!conversation.admins.find((a) => a.toString() === memberId)) {
      conversation.admins.push(memberId);
    }
    await conversation.save();
    conversation.participants.forEach((participantId) => {
      const socketId = getReceiverSocketId(participantId.toString());
      if (socketId) io.to(socketId).emit("group-updated", conversation);
    });
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unsetAdmin = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const memberId = req.params.memberId;
    const userId = req.user._id.toString();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.isGroup)
      return res.status(404).json({ message: "Group not found" });

    if (!conversation.admins.find((a) => a.toString() === userId)) {
      return res.status(403).json({ message: "Only admins can demote" });
    }
    const isLastAdmin =
      conversation.admins.length === 1 &&
      conversation.admins[0].toString() === memberId.toString();
    if (isLastAdmin) {
      return res.status(400).json({ message: "Cannot remove the last admin" });
    }
    conversation.admins = conversation.admins.filter(
      (a) => a.toString() !== memberId.toString(),
    );
    await conversation.save();
    conversation.participants.forEach((participantId) => {
      const socketId = getReceiverSocketId(participantId.toString());
      if (socketId) io.to(socketId).emit("group-updated", conversation);
    });
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


