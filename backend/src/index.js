import express from "express";
import users from "./routes/users.js";
import chess from "./routes/chess.js";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { storeMove } from "./services/chess.js";
import "dotenv/config.js";

const app = express();

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL,
		credentials: true
	},
});

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

io.on("connect", (socket) => {
	console.log("a user connected");

	socket.on("chat:send", (message) => {
		console.log("Message received: ", message.item.chatMsg);
		console.log(message);
		const rooms = Array.from(socket.rooms);
		console.log("rooms:", rooms);
		socket.to(rooms[1]).emit("chat:receive", message);
		// socket.broadcast.emit("chat:receive", message);
	});

	socket.on("room:join", function (room) {
		socket.join(room);
		console.log("a user joined room: ", socket.rooms);
	});

	socket.on("chess:move", function (data) {
		const rooms = Array.from(socket.rooms);
		console.log("rooms:", rooms);
		storeMove(rooms[1], data.pgn);
		socket.to(rooms[1]).emit("chess:updatemove", data.move);
	});
});

app.get("/", function (req, res) {
	res.send("hello world");
});

app.use("/api/user", users);

app.use("/api/chess", chess);

server.listen(port, () => {
	console.log("Server Listening on PORT:", port);
});
