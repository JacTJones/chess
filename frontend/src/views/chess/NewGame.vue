<script setup>
import TheChatRoom from "../../components/chat/TheChatRoom.vue";
import { authHeader } from "../../auth/auth-header";
import axios from "axios";
import { ref, onBeforeMount } from "vue";
import { useUserStore } from "../../stores/user.js";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const opponentOptions = ref([{ label: "Select Opponnent", email: null }]);
const opponentSelection = ref(opponentOptions.value[0]);

const gameTypeOptions = ref([]);
const gameTypeSelection = ref(null);

onBeforeMount(async () => {
	// Get available games
	const gamesResponse = await axios.post(
		`${import.meta.env.VITE_API_URL}/api/chess/get-available-games/`,
		null,
		{ headers: authHeader() }
	);
	for (let i = 0; i < gamesResponse.data.gameTypes.length; i++) {
		gameTypeOptions.value.push({
			label: gamesResponse.data.gameTypes[i].game_type_name,
			id: gamesResponse.data.gameTypes[i].id,
			description: gamesResponse.data.gameTypes[i].description,
		});
		gameTypeSelection.value = gameTypeOptions.value[0];
	}

	// Get available users
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/api/user/get-available/`,
		{ user: userStore.user },
		{ headers: authHeader() }
	);
	for (let i = 0; i < response.data.users.length; i++) {
		opponentOptions.value.push({
			label: `${response.data.users[i].first_name} ${response.data.users[i].last_name}`,
			email: response.data.users[i].email,
		});
	}
});

const createGame = async () => {
	if (opponentSelection.value.email === null) {
		alert("Please select an opponent");
		return;
	}
	console.log(opponentSelection.value.email);
	const data = {
		gameType: gameTypeSelection.value,
		creatorUser: userStore.user.email,
		invitedUser: opponentSelection.value.email,
	};
	console.log(data);
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/api/chess/new-game/`,
		data,
		{
			headers: authHeader(),
		}
	);

	if (response.status === 200) {
		router.push(`/chess/game/${response.data.gameId}`);
	}
};
</script>

<template>
	<div v-if="userStore.status.loggedIn">
		<div class="card w-50 p-2 mx-auto mt-2">
			<label for="gameTypeInput">Select Game Type</label>
			<select
				class="form-control"
				id="gameTypeInput"
				v-model="gameTypeSelection"
			>
				<option
					v-for="gameType in gameTypeOptions"
					:key="gameType"
					:value="gameType"
				>
					{{ gameType.label }}
				</option>
			</select>
			<label for="opponentSelection">Select Opponent</label>
			<select
				class="form-control"
				id="opponentSelection"
				v-model="opponentSelection"
			>
				<option
					v-for="opponent in opponentOptions"
					:key="opponent"
					:value="opponent"
				>
					{{ opponent.label }}
				</option>
			</select>
			<button class="btn btn-success mt-2" @click="createGame()">
				Start Game
			</button>
		</div>
	</div>
</template>

<style></style>
