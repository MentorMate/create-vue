import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

if (process.env.NODE_ENV === 'development') {
  const VueAxe = require('vue-axe').default
  App.use(VueAxe)
}
