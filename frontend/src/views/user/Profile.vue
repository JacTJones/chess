<script setup>
import { useUserStore } from "../../stores/user.js";
import { useRoute, useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const validUser = ref(false);
const loading = ref(true);

const openGames = ref(null);
const completedGames = ref(null);

onBeforeMount(async () => {
	// Get user profile
	const response = await axios.post(
		`${import.meta.env.VITE_API_URL}/api/user/get-profile/`,
		{ id: route.params.id, user: userStore.user }
	);
	if (response.status === 400) {
		if (response.data.message === "No user with this id.") {
			validUser.value = false;
		}
	} else if (response.status === 200) {
		completedGames.value = response.data.pastGames;
		openGames.value = response.data.openGames;
		validUser.value = true;
		loading.value = false;
	}
});
</script>

<template>
	<div v-if="loading"><h1>Loading...</h1></div>
	<div v-else>
		<div v-if="validUser">
			<h1>
				{{ userStore.user.firstName }} {{ userStore.user.lastName }}'s Profile
			</h1>
			<div class="row">
				<div class="col" v-if="userStore.user.id == route.params.id">
					<div class="card">
						<div class="card-header">Open Games</div>
						<div class="card-body">
							<div v-for="game in openGames" :key="game.id">
								<div class="card mb-2">
									<div class="card-header">
										<p>
											{{ game.creator_first_name }}
											{{ game.creator_last_name }} VS
											{{ game.opponent_first_name }}
											{{ game.opponent_last_name }}
										</p>
									</div>
									<div class="card-body">
										<p>Game Type: {{ game.game_type_name }}</p>
										<p>Game Status: {{ game.status }}</p>
										<button
											class="btn btn-primary"
											@click="router.push(`/chess/game/${game.id}`)"
										>
											Go To Game
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col">
					<div class="card">
						<div class="card-header">Completed Games</div>
						<div class="card-body">
							<div v-for="game in completedGames" :key="game.id">
								<div class="card mb-2">
									<div class="card-header">
										<p>
											<span
												:class="{
													'text-green': game.winner === 'creator',
													'text-red': game.winner === 'opponent',
												}"
											>
												{{ game.creator_first_name }}
												{{ game.creator_last_name }}</span
											>
											VS
											<span
												:class="{
													'text-green': game.winner === 'opponent',
													'text-red': game.winner === 'creator',
												}"
												>{{ game.opponent_first_name }}
												{{ game.opponent_last_name }}</span
											>
										</p>
									</div>
									<div class="card-body">
										<p>Game Type: {{ game.game_type_name }}</p>
										<button
											class="btn btn-primary"
											@click="router.push(`/chess/game/${game.id}`)"
										>
											Go To Game
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<h1>No user with this id.</h1>
		</div>
	</div>
</template>

<style scoped>
.text-green {
	color: green;
}

.text-red {
	color: red;
}
</style>
