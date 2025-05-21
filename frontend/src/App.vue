<script setup>
import TheNavbar from "./components/UI/TheNavbar.vue";
import { useConnectionStore } from "./stores/connection";
import { socket } from "./socket";

const connectionStore = useConnectionStore();

socket.off();

connectionStore.bindEvents();
</script>

<template>
	<div>
		<TheNavbar />
		<router-view />
	</div>
</template>
