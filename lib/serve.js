const chalk = require('chalk')
const { spawn } = require('child_process')
const chokidar = require('chokidar')
const path = require('path')

module.exports.serve = (file, options) => {
  const projectDir = process.cwd()
  const entryFile = path.join(projectDir, file)

  // Dev mode if passed --dev param
  let childProcess, debouncedRestartServer = debounce(restartServer, 1000)
  if (options.dev) {
    chokidar.watch(projectDir, {
      ignored: (path) => path.includes('node_modules')
    }).on('ready', () => {
      debouncedRestartServer()
    }).on('change', (path) => {
      debouncedRestartServer()
    })
  } else {
    spawn('node', [entryFile], { stdio: 'inherit' })
    console.log('Say Hello:          http://localhost:3000/greeting')
    console.log('Server running at:  http://localhost:3000')
  }

  function restartServer() {
    console.clear()
    console.log(chalk.green('Restarted Successfully!\n'))
    console.log('Say Hello:          http://localhost:3000/greeting')
    console.log('Server running at:  http://localhost:3000')

    if (childProcess) childProcess.kill()
    childProcess = spawn('node', [entryFile], { stdio: 'inherit' })
  }
}

function debounce(fn, delay) {
  let timeout
  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(fn, delay);
  }
}
