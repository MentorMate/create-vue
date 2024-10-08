import getCommand from './getCommand'

const sfcTypeSupportDoc = [
  '',
  '## Type Support for `.vue` Imports in TS',
  '',
  'TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking.In editors, we need[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.',
  ''
].join('\n')

export default function generateReadme({
  projectName,
  packageManager,
  needsTypeScript,
  needsCypress,
  needsNightwatch,
  needsCypressCT,
  needsNightwatchCT,
  needsPlaywright,
  needsVitest,
  needsVueUse,
  needsI18n,
  needsSonarQube,
  needsTanStackQuery,
  needsTailwind
}) {
  const commandFor = (scriptName: string, args?: string) =>
    getCommand(packageManager, scriptName, args)

  let readme = `# ${projectName}

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).
${needsTypeScript ? sfcTypeSupportDoc : ''}
## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

`

  let npmScriptsDescriptions = `\`\`\`sh
${commandFor('install')}
\`\`\`

### Compile and Hot-Reload for Development

\`\`\`sh
${commandFor('dev')}
\`\`\`

### ${needsTypeScript ? 'Type-Check, ' : ''}Compile and Minify for Production

\`\`\`sh
${commandFor('build')}
\`\`\`
`

  if (needsVitest) {
    npmScriptsDescriptions += `
### Run Unit Tests with [Vitest](https://vitest.dev/)

\`\`\`sh
${commandFor('test:unit')}
\`\`\`
`
  }

  if (needsCypressCT) {
    npmScriptsDescriptions += `
### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

\`\`\`sh
${commandFor('test:unit:dev')} # or \`${commandFor('test:unit')}\` for headless testing
\`\`\`
`
  }

  if (needsCypress) {
    npmScriptsDescriptions += `
### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

\`\`\`sh
${commandFor('test:e2e:dev')}
\`\`\`

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with \`test:e2e\` before deploying (e.g. in CI environments):

\`\`\`sh
${commandFor('build')}
${commandFor('test:e2e')}
\`\`\`
`
  }

  if (needsNightwatch) {
    npmScriptsDescriptions += `
### Run End-to-End Tests with [Nightwatch](https://nightwatchjs.org/)

\`\`\`sh
# When using CI, the project must be built first.
${commandFor('build')}

# Runs the end-to-end tests
${commandFor('test:e2e')}
# Runs the tests only on Chrome
${commandFor('test:e2e', '--env chrome')}
# Runs the tests of a specific file
${commandFor('test:e2e', `tests/e2e/example.${needsTypeScript ? 'ts' : 'js'}`)}
# Runs the tests in debug mode
${commandFor('test:e2e', '--debug')}
\`\`\`
    `
  }

  if (needsNightwatchCT) {
    npmScriptsDescriptions += `
### Run Headed Component Tests with [Nightwatch Component Testing](https://nightwatchjs.org/guide/component-testing/introduction.html)
  
\`\`\`sh
${commandFor('test:unit')}
${commandFor('test:unit -- --headless # for headless testing')}
\`\`\`
`
  }

  if (needsPlaywright) {
    npmScriptsDescriptions += `
### Run End-to-End Tests with [Playwright](https://playwright.dev)

\`\`\`sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
${commandFor('build')}

# Runs the end-to-end tests
${commandFor('test:e2e')}
# Runs the tests only on Chromium
${commandFor('test:e2e', '--project=chromium')}
# Runs the tests of a specific file
${commandFor('test:e2e', 'tests/example.spec.ts')}
# Runs the tests in debug mode
${commandFor('test:e2e', '--debug')}
\`\`\`
`
  }

  npmScriptsDescriptions += `
### Lint with [ESLint](https://eslint.org/), including [plugin](https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/) for checking accessibility rules

\`\`\`sh
${commandFor('lint')}
\`\`\`
`

  if (needsVueUse) {
    npmScriptsDescriptions += `
### Collection of utility functions based on Composition API [VueUse](https://vueuse.org/guide/)
`
  }

  if (needsI18n) {
    npmScriptsDescriptions += `
### Internationalization plugin for Vue.js [Vue I18n](https://vue-i18n.intlify.dev/)
`
  }

  if (needsSonarQube) {
    npmScriptsDescriptions += `
### Clean code for teams and enterprises [SonarQube](https://www.sonarsource.com/products/sonarqube/)
`
  }

  npmScriptsDescriptions += `
### Modern native git hooks made easy [Husky](https://typicode.github.io/husky/)
`

  if (needsTanStackQuery) {
    npmScriptsDescriptions += `
### Powerful asynchronous state management [TanStack Query](https://tanstack.com/query/latest)
`
  }

  if (needsTailwind) {
    npmScriptsDescriptions += `
### A utility-first CSS framework packed with classes [Tailwind](https://tailwindcss.com/docs/installation)
`
  }

  readme += npmScriptsDescriptions

  return readme
}
