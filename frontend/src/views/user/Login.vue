<script setup>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../../stores/user.js";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();
const email = ref(null);
const password = ref(null);

const login = async () => {
	// Check if email provided is a valid email address
	if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
		alert("Please enter a valid email address");
		return;
	}

	// Check if password is provided
	if (!password.value) {
		alert("Password is required");
		return;
	}

	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/api/user/login`,
			{
				email: email.value,
				password: password.value,
			}
		);
		if (response.data.accessToken) {
			userStore.login(response.data);
			// Set router to previous page
			router.back();
		}
	} catch (error) {
		alert("Invalid email or password");
	}
};
</script>

<template>
	<div class="container w-50 border rounded mt-4">
		<div class="form-group">
			<label for="emailInput">Email address</label>
			<input
				type="email"
				class="form-control"
				id="emailInput"
				placeholder="Email"
				v-model="email"
			/>
		</div>
		<div class="form-group">
			<label for="passwordInput">Password</label>
			<input
				type="password"
				class="form-control"
				id="passwordInput"
				placeholder="Password"
				v-model="password"
			/>
		</div>
		<button class="btn btn-primary mt-2" @click="login()">Login</button>
		<br />
		<!-- <small id="emailHelp" class="form-text text-muted"
			>Forgot your password?
			<router-link to="/user/reset-password"
				>Reset password here.</router-link
			></small
		> -->
	</div>
</template>

<style scoped></style>
