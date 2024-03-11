const { Router } = require("express");

const MessageManager = require("../../../dao/mongoManagers/MessageManager");
const messageManager = new MessageManager();
const messageRouter = Router();

messageRouter.get("/", async (req, res) => {
  let { limit } = req.query;

  // Validate limit format
  if (!Number(limit)) limit = 0;

  const messages = await messageManager.getAllMessages();
  return res
    .status(200)
    .json(limit > 0 ? messages.slice(0, limit) : messages || []);
});

messageRouter.post("/", async (req, res) => {
  let { user, message } = req.body;
  if (!user || !message) return res.status(400).send(); // Message not sent;

  const result = await messageManager.addMessage({ user, message });
  if (result === null) return res.status(500).send();
  return res.status(200).end();
});

messageRouter.delete("/", async (req, res) => {
  // Respond to the user request
  const message = await messageManager.deleteAllMessages();
  if (!message) return res.status(500).send();
  return res.status(200).send();
});

module.exports = messageRouter;
