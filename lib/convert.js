const ui = require('yacliui')
const fs = require('fs-extra')
const chalk = require('chalk')
const path = require('path')

const convertJsonToCsv = async (data, delimiter = ';', rows = ['name', 'email', 'website', 'rating', 'address', 'phone', 'claimed']) => {
  const header = rows.join(delimiter) + '\n'
  var body = ''

  for (const entry of data) {
    let line = ''
    //console.log(entry)
    for (i=0;i<rows.length;i++) {
      //console.log(entry[rows[i]])
      if (entry[rows[i]] !== undefined ) {
        if (rows[i] === 'claimed') {
          line += entry[rows[i]] ? 'yes' : 'no'
        } else {
          line += entry[rows[i]]
        }
      } else {        
        line += ''
      }
      line += (i < rows.length - 1) ? ';' : ''
    }
    //console.log(entry, line)
    body += line + '\n'
  }
  return header + body
}



const convertJsonToMailJson = async (data, rows = ['name', 'email', 'website', 'rating', 'address', 'phone', 'claimed']) => {
  var json = []

  json.push(rows)
  for (const entry of data) {
    let line = []
    for (i=0;i<rows.length;i++) {
      if (entry[rows[i]] !== undefined) {
        if (rows[i] === 'claimed') {
          line.push(entry[rows[i]] ? 'yes' : 'no')
        } else {
          line.push(entry[rows[i]])
        }
      } else {
        line.push('')
      }
    }
    json.push(line)
  }
  return json
}


const convertCsvToMailJson = async (data, delimiter = ';', rows = ['name', 'email', 'website', 'rating', 'address', 'phone', 'claimed']) => {

  const json = []
  const lines = data.split('\n').filter(Boolean)
  const availableRows = lines[0].split(delimiter)
  const rowIds = []

  // Check if every specified row is in the data
  for (let i = 0; i < rows.length; i++) {
    const row = availableRows.indexOf(rows[i])
    if (row !== -1) rowIds.push(row)
  }

  json.push(rows)

  for (let i=1;i<lines.length;i++) {
    const entries = lines[i].split(delimiter)
    let set = []
    for (let j=0;j<rowIds.length;j++) {
      set.push(entries[rowIds[j]])
    }
    json.push(set)
  }

  return json
}


const convertCsvToJson = async (data, delimiter = ';', rows = ['name', 'email', 'website', 'rating', 'address', 'phone', 'claimed']) => {
  const json = []
  const lines = data.split('\n').filter(Boolean)
  const availableRows = lines[0].split(delimiter)
  const rowIds = []

  // Check if every specified row is in the data
  for (let i = 0; i < rows.length; i++) {
    const row = availableRows.indexOf(rows[i])
    if (row !== -1) rowIds.push(row)
  }

  for (let i = 1; i < lines.length; i++) {
    const entries = lines[i].split(delimiter)
    const set = {}
    for (let j = 0; j < rowIds.length; j++) {
      set[availableRows[rowIds[j]]] = entries[rowIds[j]]
    }
    json.push(set)
  }

  return json
}


const init = async (from, to, options) => {
  ui.info('Start converting ' + chalk.green(path.basename(from)) + ' to ' + chalk.green(path.basename(to)) + '...\n')
  
  if (options.from === '.json' && options.to === '.csv') {
    // JSON -> CSV

    const data = await fs.readJson(from)
    const converted = await convertJsonToCsv(data)
    await fs.outputFile(to, converted)
    ui.info('Conversion to the file ' + chalk.green(path.basename(to)) + ' finished!')

  } else if (options.from === '.json' && (options.to === '.mail.json' || options.to === '.csv.json')) {
    // JSON -> MAIL.JSON

    const data = await fs.readJson(from)
    const converted = await convertJsonToMailJson(data)
    ui.info('Conversion to the file ' + chalk.green(path.basename(to)) + ' finished!')
    await fs.outputJSON(to, converted, { spaces: 2 })
    
  } else if (options.from === '.csv' && (options.to === '.mail.json' || options.to === '.csv.json')) {
    // CSV -> MAIL.JSON
    
    const data = await fs.readFile(from, 'utf-8')
    const converted = await convertCsvToMailJson(data)
    await fs.outputJSON(to, converted, { spaces: 2 })
    ui.info('Conversion to the file ' + chalk.green(path.basename(to)) + ' finished!')
    
  } else if (options.from === '.csv' && options.to === '.json') {
    // CSV -> JSON
    
    const data = await fs.readFile(from, 'utf-8')
    const converted = await convertCsvToJson(data)
    await fs.outputJSON(to, converted, { spaces: 2 })
    ui.info('Conversion to the file ' + chalk.green(path.basename(to)) + ' finished!')
  }
}

module.exports = {
  init
}