import express from "express";
import bodyPaser from "body-parser";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import http from "http";
import { authService } from "./db/firebaseService";
import cros from "cors";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:3000"],
    credentials: true,
  },
});
instrument(io, { auth: false });

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(
  cros({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.render("home"));

app.post("/test", (req, res) => console.log(req.query));
app.post("/login", async (req, res) => {
  const {
    body: { email, pw },
  } = req;
  try {
    await authService
      .signInWithEmailAndPassword(email, pw)
      .then((user) => {
        const {
          user: { uid, email, displayName },
        } = user;
        console.log(`Sign In : ${uid}, ${email}, ${displayName}`);
        res.send({
          userObj: user.user,
        });
      })
      .catch((err) => {
        console.log(`Sign In Error : ${err}`);
        res.send({
          status: 500,
        });
      });
  } catch (err) {
    console.log(err);
  }
});
app.post("/register", async (req, res) => {
  const {
    body: { email, pw },
  } = req;
  try {
    await authService
      .createUserWithEmailAndPassword(email, pw)
      .then((user) => {
        const {
          user: { uid, email, displayName },
        } = user;
        console.log(`Register : ${uid}, ${email}, ${displayName}`);
        res.send({
          userObj: user.user,
        });
      })
      .catch((err) => {
        console.log(`Register Error : ${err}`);
        res.send({
          status: 500,
        });
      });
  } catch (err) {
    console.log(err);
  }
});

const handleListen = () => {
  console.log("Listening on http://localhost:3002");
};

io.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
    console.log(`Join Room Event: ${roomName}`);
    console.log(io.sockets.adapter.sids);
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });

  // Socket Test
  socket.on("test", () => console.log("Test successful"));
});

httpServer.listen(3002, handleListen);
