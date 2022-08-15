const { write } = require("../utils/write")
const Live = require("../data/live.json")
let Claps = require("../data/claps.json")
let Flags = require("../data/flags.json")
let Streamer = require("../data/streamer.json")
let Store = require("../data/store.json")
let Queue = require("../data/queue.json")
let Notes = require("../data/notes.json")

const sPath = "./data/streamer.json"
const lPath = "./data/live.json"
const fPath = "./data/flags.json"
const cPath = "./data/claps.json"
const stPath = "./data/store.json"
const qPath = "./data/queue.json"
const nPath = "./data/notes.json"

// =================== Streamer ======================

async function getStreamer() {
  return new Promise((resolve) => {
    resolve(Streamer[0])
  })
}

async function writeStreamer(obj) {
  return new Promise((resolve) => {
    Streamer.push(obj)
    write(sPath, Streamer)
    resolve(obj)
  })
}

async function updateStreamer(obj) {
  return new Promise((resolve) => {
    Streamer[0] = obj
    write(sPath, Streamer)
    resolve(obj)
  })
}

async function remove() {
  try {
    return new Promise((resolve) => {
      Streamer = []
      write(sPath, Streamer)
      resolve()
    })
  } catch (error) {
    console.log(error)
  }
}

// =================== Live ======================

async function getLive() {
  return new Promise((resolve) => {
    resolve(Live[0].isLive)
  })
}

async function setLive(bol) {
  return new Promise((resolve) => {
    Live[0].isLive = bol

    write(lPath, Live)
    resolve()
  })
}

// =================== Flags ======================

async function checkFlagId(id) {
  return new Promise((resolve) => {
    resolve(Flags.find((flagId) => flagId === id))
  })
}

async function addFlagId(id) {
  return new Promise((resolve) => {
    Flags.push(id)
    write(fPath, Flags)
    resolve(id)
  })
}

async function getFlagsLength() {
  return new Promise((resolve) => {
    resolve(Flags.length)
  })
}

async function resetFlags() {
  return new Promise((resolve) => {
    Flags = []
    write(fPath, Flags)
    resolve()
  })
}

// =================== Claps ======================
async function getClaps() {
  return new Promise((resolve) => {
    resolve(Claps.length)
  })
}

async function checkClap(obj) {
  return new Promise((resolve) => {
    resolve(Claps.find((c) => c === obj))
  })
}

async function addClap(obj) {
  return new Promise((resolve) => {
    Claps.push(obj)
    write(cPath, Claps)
    resolve(Claps.length)
  })
}

async function clearClaps() {
  return new Promise((resolve) => {
    Claps = []
    write(cPath, Claps)
    resolve()
  })
}

// =================== Store ======================
async function checkStore(obj) {
  return new Promise((resolve) => {
    resolve(Store.find((s) => s.token === obj))
  })
}

async function addToStore(obj) {
  return new Promise((resolve) => {
    Store.push(obj)
    write(stPath, Store)
    resolve()
  })
}

async function removeFromStore(obj) {
  return new Promise((resolve) => {
    const st = Store.filter((item) => item.token !== obj)
    write(stPath, st)
    resolve()
  })
}

// =================== Store ======================
async function queueLength() {
  return new Promise((resolve) => {
    resolve(Queue.length)
  })
}

async function queueNext() {
  return new Promise((resolve) => {
    let next = Queue[0]
    Queue.shift()
    write(qPath, Queue)
    resolve(next)
  })
}

async function queuePos(obj) {
  return new Promise((resolve) => {
    resolve(Queue.findIndex((item) => item.userId === obj))
  })
}

async function addToQueue(obj) {
  return new Promise((resolve) => {
    const check = Queue.find((item) => item.userId === obj.userId)
    if (!check) {
      Queue.push(obj)
      write(qPath, Queue)
    }
    resolve()
  })
}

// =================== Note ======================
async function getNote() {
  return new Promise((resolve) => {
    resolve(Notes[0])
  })
}

async function updateNote(obj) {
  return new Promise((resolve) => {
    Notes[0] = obj
    write(nPath, Notes)
    resolve(obj)
  })
}

module.exports = {
  getClaps,
  checkClap,
  addClap,
  clearClaps,
  getStreamer,
  writeStreamer,
  updateStreamer,
  remove,
  setLive,
  getLive,
  checkFlagId,
  addFlagId,
  getFlagsLength,
  resetFlags,
  checkStore,
  addToStore,
  removeFromStore,
  queueLength,
  queueNext,
  queuePos,
  addToQueue,
  getNote,
  updateNote,
}
