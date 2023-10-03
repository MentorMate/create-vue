import { mergeConfig, defineConfig } from 'vite'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8', // or 'istanbul'
        reporter: ['text', 'lcov', 'json', 'html']
      }
    }
  })
)
