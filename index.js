const { Command } = require('commander')
const ui = require('yacliui')
const requirements = require('./lib/requirements')
const convert = require('./lib/convert')
const chalk = require('chalk')

const app = new Command()

app
  .version(require('./package.json').version, '-V, --version')
  .description('Converts GMB Scraper Files between JSON, CSV and MAIL.JSON')

app
  .command('convert <from> <to>')
  .description('Converts between JSON, CSV and MAIL.JSON by extension')
  .option('-u, --update', 'Update the standard JSON file if possible')
  .action(async (from, to, options) => {
    
    const checked = await requirements.check(from, to)
    
    console.log(checked)
    if (checked) {
      ui.headline('Conversion')

      convert.init(from, to, checked)

    }

  })

app.parse(process.argv)
