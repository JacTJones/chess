import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Profile from "./views/user/Profile.vue";
import Login from "./views/user/Login.vue";
import Register from "./views/user/Register.vue";
import Chat from "./views/chat/ChatPage.vue";
import NewGame from "./views/chess/NewGame.vue";
import Game from "./views/chess/GameRoom.vue";

const routes = [
	{ path: "/", component: Home },
	{
		path: "/user",
		children: [
			{ path: "profile/:id", component: Profile, name: "Profile" },
			{ path: "login", component: Login },
			{ path: "register", component: Register },
		],
	},
	{
		path: "/chat",
		component: Chat,
	},
	{
		path: "/chess",
		children: [
			{ path: "new-game", component: NewGame },
			{ path: "game/:id", component: Game },
		],
		meta: {
			requiresAuth: true,
		},
	},
	{ path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth) {
		let user = JSON.parse(localStorage.getItem("user"));
		if (user && user.accessToken) {
			next();
		} else {
			alert("You must be logged in to access this page");
			next("/login");
		}
	} else {
		next();
	}
});

export default router;
