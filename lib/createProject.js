const fs = require('fs')
const path = require('path')
module.exports.createProject = (name) => {
  copyDirectory(path.resolve('template'))
}

function copyDirectory(p) {
  
}