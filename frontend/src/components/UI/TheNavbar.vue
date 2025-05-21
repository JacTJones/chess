<script setup>
import { useUserStore } from "../../stores/user.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const logout = () => {
	userStore.logout();
	router.go(0);
};
</script>
<template>
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<router-link to="/" class="navbar-brand">Chess.JJ</router-link>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarToggled"
			>
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarToggled">
				<div class="navbar-nav">
					<router-link to="/home" class="nav-link">Home</router-link>
					<router-link to="/chess/new-game" class="nav-link"
						>New Game</router-link
					>
					<router-link to="/" class="nav-link">History</router-link>
					<router-link to="/" class="nav-link">Leaderboard</router-link>
				</div>
			</div>
		</div>
		<div class="d-flex">
			<router-link v-if="!userStore.status.loggedIn" to="/user/register"
				><button class="btn btn-primary m-1">Register</button></router-link
			>
			<router-link v-if="!userStore.status.loggedIn" to="/user/login"
				><button class="btn btn-success m-1">Login</button></router-link
			>
			<button
				class="btn btn-danger m-1"
				@click="logout()"
				v-if="userStore.status.loggedIn"
			>
				Logout
			</button>
			<router-link
				v-if="userStore.status.loggedIn"
				:to="{ name: 'Profile', params: { id: userStore.user.id } }"
				><button class="btn btn-primary m-1">Profile</button></router-link
			>
		</div>
	</nav>
</template>

<style scoped></style>
