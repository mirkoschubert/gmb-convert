const ui = require('yacliui')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')

const checkFiles = async (from, to) => {
  const existsFrom = await fs.pathExists(from)
  const existsTo = await fs.pathExists(to)

  if (!existsFrom) {
    ui.error(`Your source file doesn't exists! Please check on typos.`)
    return false
  }
  if (existsTo) {
    ui.info('Your destination file already exists!')
    const overwrite = await ui.confirm('Do you wish to overwrite this file?', false)
    if (!overwrite) return false
  }
  return true
}


const checkFilnames = (from, to) => {
  const allowed = [ '.json', '.csv', '.mail.json', '.csv.json']

  var fromExt, toExt = false

  allowed.forEach(ext => {
    if (path.basename(from).toLowerCase().endsWith(ext)) fromExt =  ext
    if (path.basename(to).toLowerCase().endsWith(ext)) toExt =  ext
  })

  if (!fromExt) {
    ui.error('File Extention', chalk.green(path.extname(from)), 'is not allowed. Please read the manual!')
    return false
  }
  if (!toExt) {
    ui.error('File Extention', chalk.green(path.extname(to)), 'is not allowed. Please read the manual!')
    return false
  }
  if (toExt === '.csv.json') {
    ui.warning('File Extension', chalk.green('.csv.json'), "won't be supported any longer. Please use", chalk.green('.mail.json'), 'instead! Continuing for now...')
  }
  return { from: fromExt, to: toExt }
}

const check = async (from, to) => {
  ui.headline('Checking requirements')

  const extensions = checkFilnames(from, to)
  const files = await checkFiles(from, to)
  
  return (!files) ? false : extensions
}

module.exports = {
  check
}
