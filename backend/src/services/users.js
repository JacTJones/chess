import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { makeQuery } from "../db/mssql-pool.js";

export const add = async (req, res) => {
	// Get the data from the request
	const { firstName, lastName, email, dob, country, password } = req.body;
	const current_time = new Date().toISOString();
	// Check if the user with that email already exists
	const result = await makeQuery("SELECT * FROM users WHERE email = @email", [
		{ name: "email", value: email },
	]);
	if (result.rowsAffected[0] > 0) {
		return res.status(400).json({ message: "User already exists" });
	} else {
		// Hash and salt password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const values = [
			email,
			firstName,
			lastName,
			dob,
			country,
			hashedPassword,
			salt,
			current_time,
		];
		const result = await makeQuery(
			"INSERT INTO users (email, first_name, last_name, date_of_birth, country_iso, password, salt, register_date) VALUES (@email, @firstName, @lastName, @dateOfBirth, @countryISO, @password, @salt, @registerDate)",
			[
				{ name: "email", value: email },
				{ name: "firstName", value: firstName },
				{ name: "lastName", value: lastName },
				{ name: "dateOfBirth", value: dob },
				{ name: "countryISO", value: country },
				{ name: "password", value: hashedPassword },
				{ name: "salt", value: salt },
				{ name: "registerDate", value: current_time },
			]
		);
		if (result.rowsAffected[0] > 0) {
			return res.status(200).json({ message: "User Added Successfully" });
		} else {
			return res.status(400).json({ message: "Error adding user" });
		}
	}
};

export const login = async (req, res) => {
	// TODO: Make login update last logged in in database
	// Get the data from the request
	const { email, password } = req.body;
	// Check if email and password matches
	const result = await makeQuery("SELECT * FROM users WHERE email = @email", [
		{ name: "email", value: email },
	]);
	if (result.rowsAffected[0] > 0) {
		const user = result.recordset[0];
		const hashedPassword = await bcrypt.hash(password, user.salt);
		if (user.password === hashedPassword) {
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				algorithm: "HS256",
				allowInsecureKeySizes: true,
				expiresIn: 86400, // 24 hours
			});

			return res.status(200).json({
				message: "User Logged In Successfully",
				id: user.id,
				email: user.email,
				firstName: user.first_name,
				lastName: user.last_name,
				accessToken: token,
			});
		} else {
			return res.status(400).json({ message: "Invalid details" });
		}
	} else {
		return res.status(400).json({ message: "Invalid details" });
	}
};

export const getUsers = async (req, res) => {
	// Get the data from the request
	const { user } = req.body;
	console.log("User: ", user);
	const result = await makeQuery(
		"SELECT email, first_name, last_name, country_iso FROM users WHERE email != @email",
		[{ name: "email", value: user.email }]
	);
	if (result.rowsAffected[0] > 0) {
		console.log(result.recordset);
		return res.status(200).json({ users: result.recordset });
	} else {
		return res.status(400).json({ message: "No users available." });
	}
};

export const getProfile = async (req, res) => {
	// Get the data from the request
	const { id, user } = req.body;
	console.log("User: ", user, "Id", id);
	let response = {
		profile: null,
		openGames: null,
		pastGames: null,
	};
	const profileResult = await makeQuery(
		"SELECT email, first_name, last_name, country_iso FROM users WHERE id = @id",
		[{ name: "id", value: id }]
	);
	if (profileResult.rowsAffected[0] > 0) {
		response.profile = profileResult.recordset[0];
		console.log(profileResult.recordset[0]);
		if (user && user.id == id) {
			const openGamesResult = await makeQuery(
				`
				SELECT g.*, gt.game_type_name, u1.first_name AS creator_first_name, u1.last_name AS creator_last_name, u1.country_iso AS creator_country, u2.first_name AS opponent_first_name, u2.last_name AS opponent_last_name, u2.country_iso AS opponent_country
				FROM games g
				JOIN users u1 ON g.creator_id = u1.id
				JOIN users u2 ON g.opponent_id = u2.id
				JOIN game_types gt ON g.game_type_id = gt.id
				WHERE (g.creator_id = @id OR g.opponent_id = @id) AND (g.status = 'ongoing' OR g.status = 'not started')
				`,
				[{ name: "id", value: id }]
			);
			response.openGames = openGamesResult.recordset;
		}
		const pastGamesResult = await makeQuery(
			`
				SELECT g.*, gt.game_type_name, u1.first_name AS creator_first_name, u1.last_name AS creator_last_name, u1.country_iso AS creator_country, u2.first_name AS opponent_first_name, u2.last_name AS opponent_last_name, u2.country_iso AS opponent_country
				FROM games g
				JOIN users u1 ON g.creator_id = u1.id
				JOIN users u2 ON g.opponent_id = u2.id
				JOIN game_types gt ON g.game_type_id = gt.id
				WHERE (g.creator_id = @id OR g.opponent_id = @id) AND g.status = 'finished'
				`,
			[{ name: "id", value: id }]
		);
		response.pastGames = pastGamesResult.recordset;
		return res.status(200).json(response);
	} else {
		return res.status(400).json({ message: "No user with this id." });
	}
};
