#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

import minimist from 'minimist'
import prompts from 'prompts'
import { red, green, bold, yellow } from 'kolorist'

import ejs from 'ejs'

import * as banners from './utils/banners'

import renderTemplate from './utils/renderTemplate'
import { postOrderDirectoryTraverse, preOrderDirectoryTraverse } from './utils/directoryTraverse'
import generateReadme from './utils/generateReadme'
import generateIndex from './utils/generateIndex'
import getCommand from './utils/getCommand'
import renderEslint from './utils/renderEslint'
import { FILES_TO_FILTER } from './utils/filterList'

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true
  }

  const files = fs.readdirSync(dir)
  if (files.length === 0) {
    return true
  }
  if (files.length === 1 && files[0] === '.git') {
    return true
  }

  return false
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file)
  )
}

async function init() {
  console.log()
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner
  )
  console.log()

  const cwd = process.cwd()
  // possible options:
  // --default
  // --typescript / --ts
  // --jsx
  // --router / --vue-router
  // --pinia
  // --with-tests / --tests (equals to `--vitest --cypress`)
  // --vitest
  // --cypress
  // --nightwatch
  // --playwright
  // --tanStackQuery
  // --force (for force overwriting)
  const argv = minimist(process.argv.slice(2), {
    alias: {
      typescript: ['ts'],
      'with-tests': ['tests'],
      router: ['vue-router']
    },
    string: ['_'],
    // all arguments are treated as booleans
    boolean: true
  })

  // if any of the feature flags is set, we would skip the feature prompts
  const isFeatureFlagsUsed =
    typeof (
      argv.default ??
      argv.ts ??
      argv.jsx ??
      argv.router ??
      argv.pinia ??
      argv.tests ??
      argv.vitest ??
      argv.cypress ??
      argv.nightwatch ??
      argv.playwright ??
      argv.vueUse ??
      argv.i18n ??
      argv.storybook ??
      argv.sonarQube ??
      argv.tanStackQuery
    ) === 'boolean'

  let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'vue-project' : targetDir

  const forceOverwrite = argv.force

  let result: {
    projectName?: string
    shouldOverwrite?: boolean
    packageName?: string
    needsTypeScript?: boolean
    needsJsx?: boolean
    needsRouter?: boolean
    needsPinia?: boolean
    needsVitest?: boolean
    needsE2eTesting?: false | 'playwright' | 'nightwatch' | 'cypress'
    needsVueUse?: boolean
    needsI18n?: boolean
    needsStorybook?: boolean
    needsSonarQube?: boolean
    needsTanStackQuery?: boolean
  } = {}

  try {
    // Prompts:
    // - Project name:
    //   - whether to overwrite the existing directory or not?
    //   - enter a valid package name for package.json
    // - Project language: JavaScript / TypeScript
    // - Add JSX Support?
    // - Install Vue Router for SPA development?
    // - Install Pinia for state management?
    // - Add Cypress for testing?
    // - Add Nightwatch for testing?
    // - Add Playwright for end-to-end testing?
    // - Add VueUse - Collection of essential Composition Utilities?
    // - Add i18n - internationalization plugin?
    // - Add Storybook?
    // - Add SonarQube for code coverage?
    // - Add TanStack Query - Hooks for fetching, caching and updating asynchronous data?
    result = await prompts(
      [
        {
          name: 'projectName',
          type: targetDir ? null : 'text',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
        },
        {
          name: 'shouldOverwrite',
          type: () => (canSkipEmptying(targetDir) || forceOverwrite ? null : 'confirm'),
          message: () => {
            const dirForPrompt =
              targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`

            return `${dirForPrompt} is not empty. Remove existing files and continue?`
          }
        },
        {
          name: 'overwriteChecker',
          type: (prev, values) => {
            if (values.shouldOverwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          }
        },
        {
          name: 'packageName',
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          message: 'Package name:',
          initial: () => toValidPackageName(targetDir),
          validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name'
        },
        {
          name: 'needsTypeScript',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add TypeScript?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsJsx',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add JSX Support?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsRouter',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add Vue Router for Single Page Application development?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsPinia',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add Pinia for state management?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsVitest',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add Vitest for Unit Testing?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsE2eTesting',
          type: () => (isFeatureFlagsUsed ? null : 'select'),
          message: 'Add an End-to-End Testing Solution?',
          initial: 0,
          choices: (prev, answers) => [
            { title: 'No', value: false },
            {
              title: 'Playwright',
              value: 'playwright'
            },
            {
              title: 'Nightwatch',
              description: answers.needsVitest
                ? undefined
                : 'also supports unit testing with Nightwatch Component Testing',
              value: 'nightwatch'
            },
            {
              title: 'Cypress',
              description: answers.needsVitest
                ? undefined
                : 'also supports unit testing with Cypress Component Testing',
              value: 'cypress'
            }
          ]
        },
        {
          name: 'needsVueUse',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add VueUse - Collection of essential Composition Utilities?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsI18n',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add i18n - internationalization plugin?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsStorybook',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message: 'Add Storybook?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsSonarQube',
          type: (prev, values) => {
            if (isFeatureFlagsUsed || !values.needsVitest) {
              return null
            }
            return 'toggle'
          },
          message: 'Add SonarQube for code coverage?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        },
        {
          name: 'needsTanStackQuery',
          type: () => (isFeatureFlagsUsed ? null : 'toggle'),
          message:
            'Add TanStack Query - Hooks for fetching, caching and updating asynchronous data?',
          initial: false,
          active: 'Yes',
          inactive: 'No'
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  // `initial` won't take effect if the prompt type is null
  // so we still have to assign the default values here
  const {
    projectName,
    packageName = projectName ?? defaultProjectName,
    shouldOverwrite = argv.force,
    needsJsx = argv.jsx,
    needsTypeScript = argv.typescript,
    needsRouter = argv.router,
    needsPinia = argv.pinia,
    needsVitest = argv.vitest || argv.tests,
    needsVueUse = argv.vueUse,
    needsI18n = argv.i18n,
    needsStorybook = argv.storybook,
    needsSonarQube = argv.needsSonarQube,
    needsTanStackQuery = argv.needsTanStackQuery
  } = result

  const { needsE2eTesting } = result
  const needsCypress = argv.cypress || argv.tests || needsE2eTesting === 'cypress'
  const needsCypressCT = needsCypress && !needsVitest
  const needsNightwatch = argv.nightwatch || needsE2eTesting === 'nightwatch'
  const needsNightwatchCT = needsNightwatch && !needsVitest
  const needsPlaywright = argv.playwright || needsE2eTesting === 'playwright'

  const root = path.join(cwd, targetDir)

  if (fs.existsSync(root) && shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\nScaffolding project in ${root}...`)

  const pkg = { name: packageName, version: '0.0.0' }
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

  // todo:
  // work around the esbuild issue that `import.meta.url` cannot be correctly transpiled
  // when bundling for node and the format is cjs
  // const templateRoot = new URL('./template', import.meta.url).pathname
  const templateRoot = path.resolve(__dirname, 'template')
  const callbacks = []
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName)
    renderTemplate(templateDir, root, callbacks)
  }
  // Render base template
  render('base')

  // Add configs.
  if (needsJsx) {
    render('config/jsx')
  }
  if (needsRouter) {
    render('config/router')
  }
  if (needsPinia) {
    render('config/pinia')
  }
  if (needsVitest) {
    render('config/vitest')
  }
  if (needsPlaywright) {
    render('config/playwright')
  }
  if (needsNightwatch) {
    render('config/nightwatch')
  }
  if (needsNightwatchCT) {
    render('config/nightwatch-ct')
  }
  if (needsCypress) {
    render('config/cypress')
  }
  if (needsCypressCT) {
    render('config/cypress-ct')
  }

  if (needsTypeScript) {
    render('config/typescript')

    // Render tsconfigs
    render('tsconfig/base')
    if (needsCypress) {
      render('tsconfig/cypress')
    }
    if (needsCypressCT) {
      render('tsconfig/cypress-ct')
    }
    if (needsPlaywright) {
      render('tsconfig/playwright')
    }
    if (needsVitest) {
      render('tsconfig/vitest')
    }
    if (needsNightwatch) {
      render('tsconfig/nightwatch')
    }
    if (needsNightwatchCT) {
      render('tsconfig/nightwatch-ct')
    }
  }

  if (needsVueUse) {
    render('config/vueUse')
  }
  if (needsI18n) {
    render('config/i18n')
  }
  if (needsSonarQube) {
    render('config/sonarQube')
  }

  if (needsTanStackQuery) {
    render('config/tanStackQuery')
  }

  // Render ESLint config
  // By default ESLint, Prettier and Husky will be added
  renderEslint(root, { needsTypeScript, needsCypress, needsCypressCT })
  render('config/husky')

  // Render code template.
  // prettier-ignore
  const codeTemplate =
    (needsTypeScript ? 'typescript-' : '') +
    (needsRouter ? 'router' : 'default')
  render(`code/${codeTemplate}`)

  // main.js generation
  fs.writeFileSync(
    path.resolve(`${root}/src`, 'main.js'),
    generateIndex({
      needsPinia,
      needsRouter,
      needsI18n,
      needsTanStackQuery
    })
  )

  // An external data store for callbacks to share data
  const dataStore = {}
  // Process callbacks
  for (const cb of callbacks) {
    await cb(dataStore)
  }

  // EJS template rendering
  preOrderDirectoryTraverse(
    root,
    () => {},
    (filepath) => {
      if (filepath.endsWith('.ejs')) {
        const template = fs.readFileSync(filepath, 'utf-8')
        const dest = filepath.replace(/\.ejs$/, '')
        const content = ejs.render(template, dataStore[dest])

        fs.writeFileSync(dest, content)
        fs.unlinkSync(filepath)
      }
    }
  )

  // Cleanup.

  // We try to share as many files between TypeScript and JavaScript as possible.
  // If that's not possible, we put `.ts` version alongside the `.js` one in the templates.
  // So after all the templates are rendered, we need to clean up the redundant files.
  // (Currently it's only `cypress/plugin/index.ts`, but we might add more in the future.)
  // (Or, we might completely get rid of the plugins folder as Cypress 10 supports `cypress.config.ts`)

  if (needsTypeScript) {
    // Convert the JavaScript template to the TypeScript
    // Check all the remaining `.js` files:
    //   - If the corresponding TypeScript version already exists, remove the `.js` version.
    //   - Otherwise, rename the `.js` file to `.ts`
    // Remove `jsconfig.json`, because we already have tsconfig.json
    // `jsconfig.json` is not reused, because we use solution-style `tsconfig`s, which are much more complicated.
    preOrderDirectoryTraverse(
      root,
      () => {},
      (filepath) => {
        if (filepath.endsWith('.js') && !FILES_TO_FILTER.includes(path.basename(filepath))) {
          const tsFilePath = filepath.replace(/\.js$/, '.ts')
          if (fs.existsSync(tsFilePath)) {
            fs.unlinkSync(filepath)
          } else {
            fs.renameSync(filepath, tsFilePath)
          }
        } else if (path.basename(filepath) === 'jsconfig.json') {
          fs.unlinkSync(filepath)
        }
      }
    )

    // Rename entry in `index.html`
    const indexHtmlPath = path.resolve(root, 'index.html')
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8')
    fs.writeFileSync(indexHtmlPath, indexHtmlContent.replace('src/main.js', 'src/main.ts'))
  } else {
    // Remove all the remaining `.ts` files
    preOrderDirectoryTraverse(
      root,
      () => {},
      (filepath) => {
        if (filepath.endsWith('.ts')) {
          fs.unlinkSync(filepath)
        }
      }
    )
  }

  // Instructions:
  // Supported package managers: pnpm > yarn > npm
  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'

  // README generation
  fs.writeFileSync(
    path.resolve(root, 'README.md'),
    generateReadme({
      projectName: result.projectName ?? result.packageName ?? defaultProjectName,
      packageManager,
      needsTypeScript,
      needsVitest,
      needsCypress,
      needsNightwatch,
      needsPlaywright,
      needsNightwatchCT,
      needsCypressCT,
      needsVueUse,
      needsI18n,
      needsSonarQube
    })
  )

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    const cdProjectName = path.relative(cwd, root)
    console.log(
      `  ${bold(green(`cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`))}`
    )
  }
  console.log(`  ${bold(yellow('In order to use husky you need to initialize git'))}`)
  console.log(`  ${bold(green('git init'))}`)
  console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
  console.log(`  ${bold(green(getCommand(packageManager, 'format')))}`)
  if (needsStorybook) {
    console.log(`  ${bold(green('npx storybook@latest init --builder vite'))}`)
  }
  if (needsSonarQube) {
    console.log(`  ${bold(yellow('Do not forget to update sonar-project.properties'))}`)
  }
  console.log(`  ${bold(green(getCommand(packageManager, 'dev')))}`)
  console.log()
}

init().catch((e) => {
  console.error(e)
})
