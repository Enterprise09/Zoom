import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => {
  console.log("Listening on http://localhost:3000");
};

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("Connected to Browser");
  socket["nickname"] = "Anknown";
  sockets.push(socket);
  socket.on("close", () => console.log("Disconnect from the Browser"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} : ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
});

const sockets = [];

server.listen(3000, handleListen);
