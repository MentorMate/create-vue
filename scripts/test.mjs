#!/usr/bin/env zx
import 'zx/globals'

const playgroundDir = path.resolve(__dirname, '../playground/')

let projects = fs
  .readdirSync(playgroundDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .filter((name) => !name.startsWith('.') && name !== 'node_modules')

if (process.argv[3]) projects = projects.filter((project) => project.includes(process.argv[3]))

cd(playgroundDir)

for (const projectName of projects) {
  cd(path.resolve(playgroundDir, projectName))
  const packageJSON = require(path.resolve(playgroundDir, projectName, 'package.json'))

  console.log('Initializing git')
  await $`git init`
  console.log('Installing playground dependencies')
  await $`npm install`

  console.log(`
  
#####
Building ${projectName}
#####
  
  `)
  await $`npm run build`

  if ('@playwright/test' in packageJSON.devDependencies) {
    await $`npm run playwright install --with-deps`
  }

  if ('test:e2e' in packageJSON.scripts) {
    console.log(`Running e2e tests in ${projectName}`)
    await $`npm run test:e2e`
  }

  if ('test:unit' in packageJSON.scripts) {
    console.log(`Running unit tests in ${projectName}`)
    if (projectName.includes('vitest') || projectName.includes('with-tests')) {
      // Vitest would otherwise enable watch mode by default.
      await $`CI=1 npm run test:unit`
    } else {
      await $`npm run test:unit`
    }
  }

  if ('type-check' in packageJSON.scripts) {
    console.log(`Running type-check in ${projectName}`)
    await $`npm run type-check`
  }
}
