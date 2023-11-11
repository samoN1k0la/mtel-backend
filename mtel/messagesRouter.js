// routes/messages.mjs
import express from 'express';
import Message from './messages.js';

const messageRouter = express.Router();

  // Get all messages
  messageRouter.get('/messages/:sender_id/:receiver_id', async (request, res) => {
    try {
        const sender = request.params.sender_id;
        const receiver = request.params.receiver_id;
        const message = await Message.findOne({sender_id: sender, receiver_id: receiver});
        res.json(message);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

export default messageRouter