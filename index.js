import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors"
import { mongoDbCluster } from "./config/mongoConfig.js";
import Messages from "./models/chatSchema.js";
import pusherConfig from "./config/pusherConfig.js";





const app = express();
app.use(express.json());


app.use(cors())

const port = process.env.Node_env || 3600;

mongoose.connect(mongoDbCluster, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const db = mongoose.connection;
 db.once("open", () => console.log(`db opened`));



const pusher = new Pusher(pusherConfig);

Messages.watch().on("change", async (change) => {
  const messageDetail = change.fullDocument;
  if (change.operationType == "insert") {
   await pusher.trigger("chatChannel", "pushChat", 
   {
      message: messageDetail.message,
      name: messageDetail.name,
      timeStamp: messageDetail.timeStamp,
    }
    );
  }
  else {
    console.log(`Ecountered error while trying to push meaage`)
  }
});



app.get("/", (req, res) => {
  res.status(200).send("Hello world!");
});


app.post("/api/v1/messages/new", (req, res) => {
  const chatMessage = req.body;
  try {
    Messages.create(chatMessage, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    res.send(error);
  }
});



app.get("/api/v1/messages", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send(data);
    }
  });
});



app.listen(port, () => console.log(`Connected to port ---> ${port}`));
