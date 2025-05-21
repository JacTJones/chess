import { defineStore } from "pinia";
import { ref } from "vue";
import { socket } from "../socket";

export const useConnectionStore = defineStore("connection", () => {
  const isConnected = ref(false);

  const bindEvents = () => {
    socket.on("connect", () => {
      isConnected.value = true;
    });

    socket.on("disconnect", () => {
      isConnected.value = false;
    });
  }

  const connect = () => {
    socket.connect();
  }

  const disconnect = () => {
    socket.disconnect();
  }

  return { isConnected, bindEvents, connect, disconnect}
});