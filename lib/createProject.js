const chalk = require('chalk')
const spawn = require('cross-spawn')
const fs = require('fs')
const path = require('path')

module.exports.createProject = async (name) => {
  const templatePath = path.join(__dirname, '../template')
  const destination = path.join(process.cwd(), name)

  if (fs.existsSync(destination)) {
    console.log(`Directory ${chalk.green(name)} already exists.\nEither try another name or remove this folder.`)
    process.exit(0)
  }

  // Copy template directory recursively.
  await copyDirectory(templatePath, destination)

  // Generate package.json from template.json, add some attributes.
  const packageJson = JSON.parse(fs.readFileSync(path.join(templatePath, 'template.json'), 'utf8'))
  packageJson.name = name
  packageJson.scripts = {
    'start': 'koa serve ./app.js',
    'serve': 'koa serve --dev ./app.js'
  }

  // Write file, remove file and install dependencies.
  fs.writeFileSync(path.join(destination, 'package.json'), JSON.stringify(packageJson, null, 2).replace('\n', '\r\n'))
  console.log(`\nCreating a Koa project in ${chalk.green(destination)}.`)
  console.log(`\nInstalling ${chalk.yellow('koa')}, ${chalk.yellow('koa-router')} and ${chalk.yellow('koa-bodyparser')}...`)
  spawn.sync('npm', ['install', 'koa', 'koa-router', 'koa-bodyparser'], { stdio: 'inherit', cwd: destination })
  fs.renameSync(path.join(destination, 'gitignore.txt'), path.join(destination, '.gitignore'))
  fs.rmSync(path.join(destination, 'template.json'))
  fs.rmSync(path.join(destination, 'package-lock.json'))

  // Initialize repository if git has been installed.
  let git_version = spawn.sync('git', ['--version'], { encoding: 'utf8' }).stdout
  if (git_version.includes('git version')) {
    spawn.sync('git', ['init'], { cwd: destination })
    spawn.sync('git', ['add', '--ignore-errors', '.'], { cwd: destination })
    spawn.sync('git', ['commit', '--message', '\'init\''], { cwd: destination })
  } else {
    fs.rm(path.join(destination, '.gitignore'), () => { })
  }

  // Print some help info.
  console.log(`\nSuccess! Project created!`)
  console.log(`Inside the project directory, you can run these commands:`)
  console.log(`  ${chalk.green('npm run start')}\n    Start the server.\n`)
  console.log(`  ${chalk.green('npm run serve')}\n    Start the server in dev mode, once file changes the server will restart.\n`)
  console.log(`You can run the following commands to get started:\n`)
  console.log(`  ${chalk.green('cd')} ${name}\n`)
  console.log(`  ${chalk.green('npm run serve')}\n`)
}

/**
 * 
 * @param {string} fromPath 
 * @param {string} toPath 
 * @returns A Promise instance.
 */
async function copyDirectory(fromPath, toPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(toPath)
    fs.readdirSync(fromPath).forEach((p) => {
      const fromPathTemp = path.join(fromPath, p)
      const toPathTemp = path.join(toPath, p)
      if (fs.statSync(fromPathTemp).isDirectory()) {
        copyDirectory(fromPathTemp, toPathTemp)
      } else {
        fs.createReadStream(fromPathTemp, 'utf8').pipe(fs.createWriteStream(toPathTemp, 'utf8')).on('close', resolve)
      }
    })
  })
}