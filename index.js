#!/usr/bin/env node

const chalk = require('chalk')
const { Command } = require('commander');
const { createProject } = require('./lib/createProject');
const { serve } = require('./lib/serve');

const program = new Command(chalk.yellow('koa'))

program.version('1.3.0')
program.description(`You can create a project in directory named ${chalk.blueBright('myproj')} by running ${chalk.blueBright('koa create myproj')}`)
program.usage(chalk.green('create <project-directory>'))

program.command('create <project-directory>')
  .description('create a project')
  .action((name) => {
    createProject(name)
  })

program.command('serve <file>')
  .description('Run your koa application in dev mode, entry file needed.')
  .option('-d, --dev', 'The mode you choose to run your app')
  .action((file, options) => {
    serve(file, options)
  })


program.parse(process.argv)