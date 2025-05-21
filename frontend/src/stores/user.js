import { defineStore } from "pinia";
import { ref } from "vue";

const userCookie = JSON.parse(localStorage.getItem("user"));
const initialUser = userCookie
  ? {
      id: userCookie.id,
      email: userCookie.email,
      firstName: userCookie.firstName,
      lastName: userCookie.lastName,
    }
  : null;
const initialStatus = userCookie ? { loggedIn: true } : { loggedIn: false };

export const useUserStore = defineStore("user", () => {
	const user = ref(initialUser);
  const status = ref(initialStatus);
	const login = (data) => {
    console.log("login store")
    localStorage.setItem("user", JSON.stringify(data));
		status.value.loggedIn = true;
    console.log(data)
		user.value = {
      id: data.id,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
		};
	}
	const logout = () => {
    console.log('logout store')
    localStorage.removeItem('user');
		status.value.loggedIn = false;
		user.value = null;
	}

  return { user, status, login, logout}
});
