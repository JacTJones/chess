<script setup>
import TheChatRoom from "../../components/chat/TheChatRoom.vue";
import TheChessboard from "../../components/chess/TheChessboard.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../../stores/user.js";
import { ref, onBeforeMount } from "vue";
import axios from "axios";
import { authHeader } from "../../auth/auth-header";
import { useRoomStore } from "../../stores/room.js";

const userStore = useUserStore();
const roomStore = useRoomStore();

const route = useRoute();
const roomID = route.params.id;
const validUser = ref(false);
const creator = ref(null);

onBeforeMount(async () => {
	// Check if user is either creator or invited user
	console.log(userStore.user);
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/api/chess/validate-user/`,
			{ roomID: roomID, user: userStore.user.id },
			{ headers: authHeader() }
		);
		if (response.data.valid) {
			validUser.value = true;
			creator.value = response.data.creatorUser;
		}
	} catch (error) {
		console.log(error);
	}
	roomStore.joinRoom(roomID);
});
</script>

<template>
	<div v-if="validUser">
		<TheChatRoom :roomID="roomID" />
		<TheChessboard :user="userStore.user" :creator="creator" :roomID="roomID" />
	</div>
	<div v-else>
		<h1>Invalid User</h1>
	</div>
</template>

<style></style>
