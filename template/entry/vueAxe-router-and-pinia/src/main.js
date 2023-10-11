import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

if (process.env.NODE_ENV === 'development') {
  const VueAxe = require('vue-axe').default
  app.use(VueAxe)
}

app.mount('#app')
