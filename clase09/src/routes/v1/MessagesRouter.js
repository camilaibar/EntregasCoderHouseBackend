const { Router } = require("express");

const MessageManager = require("../../dao/mongoManagers/MessageManager");

class messageRouter {
  path = "/messages";
  messageRouter = Router();
  messageManager = new MessageManager();

  constructor() {
    this.initProductRouter();
  }

  initProductRouter = () => {
    this.messageRouter.get("/", async (req, res) => {
      let { limit } = req.query;

      // Validate limit format
      if (!Number(limit)) limit = 0;

      const messages = await this.messageManager.getAllMessages();
      return res
        .status(200)
        .json(limit > 0 ? messages.slice(0, limit) : messages || []);
    });

    this.messageRouter.post("/", async (req, res) => {
      let { user, message } = req.body;
      if (!user || !message) return res.status(400).send(); // Message not sent;

      const result = await this.messageManager.addMessage({ user, message });
      if (result === null) return res.status(500).send();
      return res.status(200).end();
    });

    this.messageRouter.delete("/", async (req, res) => {
      // Respond to the user request
      const message = await this.messageManager.deleteAllMessages();
      if (!message) return res.status(500).send();
      return res.status(200).send();
    });
  };
}

module.exports = messageRouter;
