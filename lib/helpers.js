const prompts = require('prompts')

const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false)
    resolve()
  }))
}

const ask = async (question, initial) => {
  const options = {
    type: 'text',
    name: 'value',
    initial: () => {
      return (typeof initial === 'string' && initial !== '') ? initial : ''
    },
    message: question
  }
  try {
    var res = await prompts(options)
    return res.value
  } catch (e) {
    console.error(e)
  }
}

const confirm = async (question, initial) => {
  const options = {
    type: 'confirm',
    name: 'value',
    initial: initial || false,
    message: question
  }
  try {
    const res = await prompts(options)
    return res.value
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  wait,
  keypress,
  ask,
  confirm
}