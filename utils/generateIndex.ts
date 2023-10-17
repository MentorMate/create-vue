export default function generateIndex({ needsPinia, needsRouter, needsI18n }) {
  let indexFile = `
import './assets/main.css'
import { createApp } from 'vue'`

  if (needsPinia) {
    indexFile += `
import { createPinia } from 'pinia'`
  }

  if (needsRouter) {
    indexFile += `
import router from './router'`
  }

  if (needsI18n) {
    indexFile += `
import { createI18n } from 'vue-i18n'`
  }

  indexFile += `
import App from './App.vue'
`

  if (needsI18n) {
    indexFile += `
// https://vue-i18n.intlify.dev/guide/introduction.html
const i18n = createI18n({
  legacy: false, // you must set false, to use Composition API
  locale: 'ja', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en: {
      msg: 'hello',
      named: '{msg} world!',
      list: '{0} world!',
      literal: "{'hello'} world!",
      the_world: 'the world',
      dio: 'DIO:',
      linked: '@:dio @:the_world !!!!'
    },
    ja: {
      msg: 'こんにちは',
      named: '{msg} 世界！',
      list: '{0} 世界！',
      literal: "{'こんにちは'} 世界！",
      the_world: 'ザ・ワールド！',
      dio: 'ディオ:',
      linked: '@:dio @:the_world'
    }
  }
})
`
  }

  indexFile += `const app = createApp(App)
`

  if (needsPinia) {
    indexFile += `app.use(createPinia())
`
  }

  if (needsRouter) {
    indexFile += `app.use(router)
`
  }

  if (needsI18n) {
    indexFile += `app.use(i18n)
`
  }

  const mount = `app.mount('#app')`

  return (indexFile += mount)
}
