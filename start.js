'use strict'



const server = require('./server')

let pid



function start () {
  server.start()
}

/**
 * Make sure all child processes are cleaned up
 */
function onInterrupt () {
  process.kill(pid, 'SIGTERM')
  process.exit()
}

/**
 * Keep track of processes, and clean up on SIGINT
 */
function monitor () {
  pid = Number(process.pid).toString()
  process.on('SIGINT', onInterrupt)
}

monitor()

start()
