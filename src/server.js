import express from "express";
import SocketIo from "socket.io";
import http from "http";

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const app = express();
const httpServer = http.createServer(app);
const io = SocketIo(httpServer);

io.on("connection", (socket) => {
  console.log(socket);
});

const handleListen = () => {
  console.log("Listening on http://localhost:3000");
};

httpServer.listen(3000, handleListen);
