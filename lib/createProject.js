const chalk = require('chalk')
const { execSync } = require('child_process')
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
  await copyDirectory(templatePath, destination)

  const packageJson = JSON.parse(fs.readFileSync(path.join(templatePath, 'template.json'), 'utf8'))
  packageJson.name = name
  packageJson.scripts = {
    'start': 'node app.js'
  }
  fs.writeFileSync(path.join(destination, 'package.json'), JSON.stringify(packageJson, null, 2))
  console.log(`\nCreating a Koa project in ${chalk.green(destination)}.`)
  console.log(`\nInstalling ${chalk.yellow('koa')}, ${chalk.yellow('koa-router')} and ${chalk.yellow('koa-bodyparser')}...`)
  execSync(`cd ${name} && npm install koa koa-router koa-bodyparser`, { stdio: 'inherit' })
  fs.rm(path.join(destination, 'template.json'), () => { })
  fs.rm(path.join(destination, 'package-lock.json'), () => { })
  console.log(`Success! Project created!`)
  console.log(`Run the following commands to get started:\n`)
  console.log(`    ${chalk.green('cd')} ${name}`)
  console.log(`    ${chalk.green('npm start')}\n`)
}

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