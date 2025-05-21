import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import router from './router';

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
