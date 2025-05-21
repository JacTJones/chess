<template>
	<div class="modal">
		<div>
			<div class="row">
				<p>What piece to upgrade to?</p>
				<div class="col">
					<button @click="decision('q')">Queen</button>
				</div>
				<div class="col">
					<button @click="decision('r')">Rook</button>
				</div>
				<div class="col">
					<button @click="decision('b')">Bishop</button>
				</div>
				<div class="col">
					<button @click="decision('n')">Knight</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const emit = defineEmits(["promotionDecision"]);

const decision = (piece) => {
	console.log(piece);
	emit("promotionDecision", piece);
};
</script>

<style scoped>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal > div {
	background: white;
	padding: 20px;
	border-radius: 8px;
}
</style>
