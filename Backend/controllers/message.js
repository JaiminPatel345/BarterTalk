import Message from "../models/message.js"
import Conversation from "../models/conversation.js"


export const getMessage = (req, res) => {

    const userId = req.params.userId

    Conversation.findOne({
            participants: {
                $all: [userId, req.user._id]
            },
        }).populate("messages")
        .then((conversation) => {
            if (!conversation) {
                const newConversation = new Conversation({
                    participants: [req.user._id, userId],
                })
                return newConversation.save()

            } else {
                return conversation
            }
        })
        .then((conversation) => {
            res.json(conversation)
        })
        .catch((error) => {
            console.log(error);
            res.status(error.status || 500).json(error.message)
        })
}

export const sendMessage = (req, res) => {
    const {
        message
    } = req.body
    const receiverId = req.params.userId
    const senderId = req.user._id

    Conversation.findOne({
        participants: {
            $all: [senderId, receiverId],
        },
    })
        .then((conversation) => {
            if (!conversation) {
                const newConversation = new Conversation({
                    participants: [receiverId, senderId],
                })
                return newConversation.save()
            } else {
                return conversation
            }
        })
        .then((conversation) => {
            return Message.create({
                senderId,
                receiverId,
                message,
            }).then((newMsg) => {
                conversation.messages.push(newMsg)
                conversation.save()
                return newMsg
            })
        })
        .then((newMsg) => {
            res.json(newMsg)
        })
        .catch((error) => {
            console.log(error)
            res.status(error.status || 500).json(error.message)
        })
}