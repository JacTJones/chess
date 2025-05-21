<script setup>
import { ref } from "vue";
import country from "country-list-js";
import axios from "axios";
import { useUserStore } from "../../stores/user.js";
import { authHeader } from "../../auth/auth-header.js";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();

const countryNames = country.names().sort();
countryNames.unshift("Select Country");

const firstName = ref(null);
const lastName = ref(null);
const email = ref(null);
const dob = ref(null);
const password = ref(null);
const confirmPassword = ref(null);
const countrySelect = ref("Select Country");

const register = async () => {
	// Check if the country value is not the default value
	let countryISO;
	if (countrySelect.value === "Select Country") {
		alert("Please select a country");
		return;
	} else {
		// Get the country ISO
		countryISO = country.findByName(countrySelect.value).code.iso3;
	}

	// Check if value for first name
	if (!firstName.value) {
		alert("First name is required");
		return;
	}

	// Check if value for last name
	if (!lastName.value) {
		alert("Last name is required");
		return;
	}

	// Check if email provided is a valid email address
	if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
		alert("Please enter a valid email address");
		return;
	}

	// Check if date of birth is provided
	if (!dob.value) {
		alert("Date of birth is required");
		return;
	}

	// Check if password is provided
	if (!password.value) {
		alert("Password is required");
		return;
	}

	// Check if the passwords match
	if (password.value !== confirmPassword.value) {
		alert("Passwords do not match");
		return;
	}

	const data = {
		firstName: firstName.value,
		lastName: lastName.value,
		email: email.value,
		dob: dob.value,
		country: countryISO,
		password: password.value,
	};

	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/api/user/register/`,
			data
		);
		router.back();
	} catch (error) {
		if (error.response.data.message === "User already exists") {
			alert("User already exists");
		} else {
			alert("An error occurred");
			console.error(error);
		}
	}
};
</script>

<template>
	<div class="container w-50 border rounded mt-4">
		<div class="form-group">
			<label for="firstNameInput">First Name</label>
			<input
				type="text"
				class="form-control"
				id="firstNameInput"
				placeholder="First Name"
				v-model="firstName"
			/>
			<label for="lastNameInput">Last Name</label>
			<input
				type="text"
				class="form-control"
				id="lastNameInput"
				placeholder="Last Name"
				v-model="lastName"
			/>
		</div>
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
			<label for="dobInput">Date of Birth</label>
			<input
				type="date"
				class="form-control"
				id="dobInput"
				placeholder="Date of Birth"
				v-model="dob"
			/>
		</div>
		<div class="form-group">
			<label for="countryInput">Country</label>
			<select class="form-control" id="countryInput" v-model="countrySelect">
				<option
					v-for="countryVal in countryNames"
					:key="countryVal"
					:value="countryVal"
				>
					{{ countryVal }}
				</option>
			</select>
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
			<label for="passwordInput">Confirm Password</label>
			<input
				type="password"
				class="form-control"
				id="confirmPasswordInput"
				placeholder="Password"
				v-model="confirmPassword"
			/>
		</div>
		<button class="btn btn-primary mt-2" @click="register">Register</button>
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
