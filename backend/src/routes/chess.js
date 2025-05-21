import express from "express";
import {
	newGame,
	validateUser,
	getGameTypes,
	getGameHistory,
} from "../services/chess.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/new-game", [verifyToken], (req, res) => {
	newGame(req, res);
});

router.post("/validate-user", [verifyToken], (req, res) => {
	validateUser(req, res);
});

router.post("/get-available-games", [verifyToken], (req, res) => {
	getGameTypes(req, res);
});

router.get("/get-game-history", (req, res) => {
	getGameHistory(req, res);
});

export default router;
