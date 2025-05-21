import jwt from "jsonwebtoken";
import { makeQuery } from "../db/mssql-pool.js";

export const newGame = async (req, res) => {
	// Get the data from the request
	const { creatorUser, gameType, invitedUser } = req.body;
	console.log(creatorUser, gameType, invitedUser);
	// Get the id for the creator user
	const creatorUserResult = await makeQuery(
		"SELECT id, email, first_name, last_name, country_iso FROM users WHERE email = @email",
		[{ name: "email", value: creatorUser }]
	);
	console.log("Creator:", creatorUserResult);
	// Get the id fro the opponnent user
	const opponentUserResult = await makeQuery(
		"SELECT id, email, first_name, last_name, country_iso FROM users WHERE email = @email",
		[{ name: "email", value: invitedUser }]
	);
	console.log("Opponent:", opponentUserResult);
	// Create the game in the database
	const result = await makeQuery(
		"INSERT INTO games (creator_id, opponent_id, game_type_id) OUTPUT Inserted.id VALUES (@creatorId, @opponentId, @gameTypeId)",
		[
			{ name: "creatorId", value: creatorUserResult.recordset[0].id },
			{ name: "opponentId", value: opponentUserResult.recordset[0].id },
			{ name: "gameTypeId", value: gameType.id },
		]
	);
	console.log(result);

	return res.status(200).json({
		gameId: result.recordset[0].id,
		creatorUser: creatorUserResult.recordset[0],
		opponentUser: opponentUserResult.recordset[0],
		gameType: gameType.id,
	});
};

export const validateUser = async (req, res) => {
	// Get the data from the request
	const { roomID, user } = req.body;

	// Get the details for the room provided
	const roomResult = await makeQuery(
		"SELECT creator_id, opponent_id, game_type_id FROM games WHERE id = @roomID",
		[{ name: "roomID", value: roomID }]
	);

	// Check if the room exists
	if (roomResult.rowsAffected[0] === 0) {
		return res.status(400).json({ message: "Invalid Room", valid: false });
	}

	// Check if the user is part of the room
	if (
		roomResult.recordset[0].creator_id !== user &&
		roomResult.recordset[0].opponent_id !== user
	) {
		return res.status(400).json({ message: "Invalid User", valid: false });
	} else {
		return res.status(200).json({
			message: "User Valid",
			valid: true,
			creatorUser: roomResult.recordset[0].creator_id,
		});
	}
};

export const getGameTypes = async (req, res) => {
	// Get the data from the request
	const result = await makeQuery("SELECT * FROM game_types");
	if (result.rowsAffected[0] > 0) {
		console.log(result.recordset);
		return res.status(200).json({ gameTypes: result.recordset });
	} else {
		return res.status(400).json({ message: "No game types available." });
	}
};

export const storeMove = async (room, pgn) => {
	const result = await makeQuery(
		"UPDATE games SET history = @history WHERE id = @roomID",
		[
			{ name: "roomID", value: room },
			{ name: "history", value: pgn },
		]
	);
	console.log(result.rowsAffected);
	// const result = await makeQuery("SELECT * FROM game_types");
	if (result.rowsAffected[0] == 0) {
		console.error("Error storing move");
	}
};

export const getGameHistory = async (req, res) => {
	const result = await makeQuery(
		"SELECT history FROM games WHERE id = @roomID",
		[{ name: "roomID", value: req.query.roomID }]
	);
	if (result.rowsAffected[0] > 0) {
		return res.status(200).json({ history: result.recordset[0].history });
	} else {
		return res.status(400).json({ message: "No history for this game." });
	}
};
