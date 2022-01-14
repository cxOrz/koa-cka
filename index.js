#!/usr/bin/env node

const chalk = require('chalk')
const { Command } = require('commander');
const { createProject } = require('./lib/createProject');

const program = new Command(chalk.yellow('koa'))

program.version('1.0.0')
program.description(`You can create a project in directory named ${chalk.blueBright('myproj')} by running ${chalk.blueBright('koa create myproj')}`)
program.usage(chalk.green('create <project-directory>'))
program.command('create <project-directory>')
  .description('create a project')
  .action((name) => {
    createProject(name)
  });

program.parse(process.argv)