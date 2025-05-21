<script setup>
import { Chess } from "chess.js";
import { Chessboard2 } from "@chrisoakman/chessboard2/dist/chessboard2.min.js";
import "@chrisoakman/chessboard2/dist/chessboard2.css";
import { ref, onMounted } from "vue";
import PromotionModal from "./ThePromotionModal.vue";
import { socket } from "../../socket";
import axios from "axios";

const game = new Chess();

socket.on("chess:updatemove", (move) => {
	console.log("move", move);
	game.move({
		from: move.from,
		to: move.to,
		promotion: move.promotion ? move.promotion : null,
	});
	console.log("Update move: ", move);
	updateBoard();
});

const props = defineProps({
	user: Object,
	creator: Number,
	roomID: String,
});

const whosTurn = ref(game.turn());
const gameStatus = ref("In Progress");
const promotionModalShown = ref(false);

let promotionMove;
const playerColour = ref(null);

let board;

onMounted(async () => {
	console.log(props.user);
	console.log(props.creator);
	playerColour.value = props.user.id === props.creator ? "w" : "b";
	const chessboardConfig = {
		position: "start",
		draggable: true,
		position: game.fen(),
		onDragStart,
		onDrop,
	};
	board = Chessboard2("board", chessboardConfig);
	const response = await axios.get(
		`${import.meta.env.VITE_API_URL}/api/chess/get-game-history`,
		{
			params: { roomID: props.roomID },
		}
	);
	if (response.data.history) {
		game.loadPgn(response.data.history);
		updateBoard();
	}
});

const updateBoard = () => {
	board.fen(game.fen(), () => {
		updateStatus();
	});
};

const onDragStart = (dragStartEvt) => {
	if (game.isGameOver()) return false;
	if (game.turn() !== pieceColour(dragStartEvt.piece)) return false;
	if (dragStartEvt.piece[0] !== playerColour.value) return false;

	const legalMoves = game.moves({
		square: dragStartEvt.square,
		verbose: true,
	});

	legalMoves.forEach((move) => {
		board.addCircle(move.to);
	});
};

function onDrop(dropEvt) {
	board.clearCircles();

	try {
		if (
			(dropEvt.piece === "wP" || dropEvt.piece === "bP") &&
			/^[a-h][18]$/.test(dropEvt.target)
		) {
			promotionModalShown.value = true;
			promotionMove = dropEvt;
			console.log("do nothing");
		} else {
			const move = game.move({
				from: dropEvt.source,
				to: dropEvt.target,
			});
			socket.emit("chess:move", { move: move, pgn: game.pgn() });
			updateBoard();
			console.log(game.pgn());
		}
	} catch (error) {
		console.log("No move", error);
		console.log(game.fen());
		return "snapback";
	}
}

const updateStatus = () => {
	whosTurn.value = game.turn() === "w" ? "w" : "b";

	if (!game.isGameOver()) {
		if (game.inCheck()) gameStatus.value = whosTurn + " is in check! ";
		gameStatus.value = whosTurn.value + " to move.";
	} else if (game.isCheckmate() && game.turn() === "w") {
		gameStatus.value = "Game over: white is in checkmate. Black wins!";
	} else if (game.isCheckmate() && game.turn() === "b") {
		gameStatus.value = "Game over: black is in checkmate. White wins!";
	} else if (game.isStalemate() && game.turn() === "w") {
		gameStatus.value = "Game is drawn. White is stalemated.";
	} else if (game.isStalemate() && game.turn() === "b") {
		gameStatus.value = "Game is drawn. Black is stalemated.";
	} else if (game.isThreefoldRepetition()) {
		gameStatus.value = "Game is drawn by threefold repetition rule.";
	} else if (game.isInsufficientMaterial()) {
		gameStatus.value = "Game is drawn by insufficient material.";
	} else if (game.isDraw()) {
		gameStatus.value = "Game is drawn by fifty-move rule.";
	}
};

const pieceColour = (piece) => {
	const whiteTest = /^w/.test(piece);
	return whiteTest ? "w" : "b";
};

const decision = (val) => {
	console.log("decision", val);
	const move = game.move({
		from: promotionMove.source,
		to: promotionMove.target,
		promotion: val,
	});
	updateBoard();
	socket.emit("chess:move", { move: move, pgn: game.pgn() });
	promotionModalShown.value = false;
};
</script>

<template>
	<div>
		<div id="board" style="width: 400px"></div>
		<PromotionModal v-if="promotionModalShown" @promotionDecision="decision" />
		{{ whosTurn }}
		Status: {{ gameStatus }} Modal value: {{ promotionModalShown }} Player
		colour: {{ playerColour }}
	</div>
</template>

<style></style>
