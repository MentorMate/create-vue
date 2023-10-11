import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())

if (process.env.NODE_ENV === 'development') {
  const VueAxe = require('vue-axe').default
  app.use(VueAxe)
}

app.mount('#app')
