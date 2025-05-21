<script setup>
import { ref } from "vue";
import { useConnectionStore } from "../../stores/connection";
import { useChatStore } from "../../stores/chat";

const props = defineProps({
  roomID: String
})

const connectionStore = useConnectionStore();
const chatStore = useChatStore();
chatStore.bindEvents();

const chatInput = ref('');


const sendMsg = () => {
	chatStore.sendMsg(chatInput.value);
	chatInput.value = "";
};
</script>

<template>
	<div class="container w-50 border rounded mt-4">
		<h1>Chat: {{ props.roomID }}</h1>
		<div>
			<div class="messages-box">
				<div v-for="msg in chatStore.chat" :key="msg.id" class="chat-message">
					<div class="chat-message-user">{{ msg.user.firstName }} {{ msg.user.lastName }}: {{ msg.chatMsg }}</div>
				</div>
			</div>
		</div>
		<div class="form-group">
			<input
				type="text"
				class="form-control"
				id="chatInput"
				placeholder="Chat"
				v-model="chatInput"
			/>
		</div>
		<div class="form-group">
			<button class="btn btn-primary m-1" @click="sendMsg()">Send</button>
		</div>
	</div>
</template>

<style></style>
