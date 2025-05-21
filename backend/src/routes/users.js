import express from "express";
import { add, login, getUsers, getProfile } from "../services/users.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/register", (req, res) => {
	add(req, res);
});

router.post("/login", (req, res) => {
	login(req, res);
});

router.post("/get-available", [verifyToken], (req, res) => {
	getUsers(req, res);
});

router.post("/get-profile", (req, res) => {
	getProfile(req, res);
});

export default router;
