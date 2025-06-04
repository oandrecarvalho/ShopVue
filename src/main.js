import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './assets/main.css'

// Configurar o Axios
axios.defaults.baseURL = 'https://dummyjson.com'

const app = createApp(App)

app.use(router)

app.mount('#app')
