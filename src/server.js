import express from "express";
import SocketIo from "socket.io";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = SocketIo(httpServer);

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  console.log(socket);
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    console.log(socket.rooms);
    done();
    socket.to(roomName).emit("welcome"); //왜 방을 만들 때는 실행이 안되는지?
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  });
});

const handleListen = () => {
  console.log("Listening on http://localhost:3000");
};

httpServer.listen(3000, handleListen);
