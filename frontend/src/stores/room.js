import { defineStore } from "pinia";
import { socket } from "../socket";
import { ref } from "vue";

export const useRoomStore = defineStore("room", () => {
	const bindEvents = () => {
		socket.on("connect", () => {
			socket.emit("chat:get", (res) => {
				// Will need to get the chat history from the server but isnt set up on server yet
			});
		});
	};

	const joinRoom = (roomID) => {
		console.log('This is an emit from joinRoom')
		socket.emit("room:join", roomID);
	};

	return { bindEvents, joinRoom };
});
