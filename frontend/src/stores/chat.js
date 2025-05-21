import { defineStore } from "pinia";
import { socket } from "../socket";
import { ref } from "vue";
import { useUserStore } from "./user";

export const useChatStore = defineStore("chat", () => {
	const userStore = useUserStore();
	const chat = ref([]);

	const bindEvents = () => {
		socket.on("chat:receive", (message) => {
			console.log("Received message: ", message);
			console.log(message);
			chat.value.push(message.item);
		});
		socket.on("connect", () => {
			socket.emit("chat:get", (res) => {
				// Will need to get the chat history from the server but isnt set up on server yet
			});
		});

	};
	
	const sendMsg = (chatMsg) => {
		console.log(userStore.user.firstName);
		const item = {
			id: Date.now(),
			chatMsg,
			user: userStore.user,
		};
		chat.value.push(item);
		console.log("IN sendMsg: ", chatMsg);

		socket.emit("chat:send", { item }, (res) => {
			console.log("Message sent: ", res.data);
		});
	};

	return { chat, bindEvents, sendMsg };
});
