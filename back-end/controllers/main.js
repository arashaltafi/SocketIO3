function main(io, socket) {
  const {
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
  } = require("../models/main")

  const update = 1
  const naira = "450"
  const loop = 1000
  const maxFlags = 5
  const queueMax = 10
  let counter
  let duration = 0
  clearBuffer()

  //============= ONLINE ====================
  let count = io.sockets.server.engine.clientsCount
  io.emit("online", count)

  getClaps().then(async (result) => {
    if (result) {
      checkClap(socket.id).then((val) => {
        const obj = {
          claps: result,
        }
        if (val) {
          obj.userId = val
        } else {
          obj.userId = ""
        }
        socket.emit("claps", obj)
      })
    }
  })

  getStreamer().then(async (result) => {
    if (result) {
      socket.emit("live", result)
    }
  })

  getNote().then(async (result) => {
    if (result) {
      socket.emit("note", result)
    } else {
      const obj = { content: "" }
      socket.emit("note", obj)
    }
  })

  //============= STREAM =====================
  socket.on("stream", async (data) => {
    clearBuffer()
    if ((await queueLength()) === 0 && !(await getLive())) {
      stream(data)
      return
    } else if ((await queueLength()) === queueMax) {
      const obj = {
        state: 0,
      }
      socket.emit("stream", obj)
      return
    } else {
      await addToQueue(data)
      const obj = {
        state: 1,
      }
      socket.emit("stream", obj)
      sendPos(data.userId)
      return
    }
  })

  socket.on("end", (data) => {
    getStreamer().then(async (result) => {
      if (result != null && result != undefined && result.userId === data) {
        result.isLive = false
        await updateStreamer(result)
        socket.broadcast.emit("live", result)
      }
    })
  })

  socket.on("camera", async (data) => {
    clearBuffer()
    if (data.platform === "web") {
      const buf = Buffer.from(data.data, "base64")
      data.data = buf
      await socket.broadcast.volatile.emit("camera", data)
    } else {
      await socket.broadcast.volatile.emit("camera", data)
    }
  })
  socket.on("audio", async (data) => {
    clearBuffer()
    await socket.broadcast.volatile.emit("audio", data)
  })
  //============= FLAG =======================
  socket.on("flag", async (data) => {
    clearBuffer()
    if (!(await checkFlagId(data))) {
      if ((await getFlagsLength()) === maxFlags) {
        getStreamer().then(async (result) => {
          if (result) {
            result.isLive = false
            result.state = 3
            await resetFlags()
            await updateStreamer(result)
            socket.emit("stream", result)
            socket.broadcast.emit("live", result)
          }
        })
      } else {
        await addFlagId(data)
      }
    }
  })

  //============= UPDATE =======================
  io.emit("update", update)

  //============= VALUE =======================
  io.emit("values", {
    naira: naira,
  })

  //============= DISPLAY ====================
  socket.on("claps", async (data) => {
    clearBuffer()
    checkClap(data).then((result) => {
      if (!result) {
        addClap(data).then(async (result) => {
          const obj = {
            claps: result,
            userId: data,
          }
          io.emit("claps", obj)
        })
      }
    })
  })

  socket.on("note", async (data) => {
    updateNote(data).then(async (result) => {
      if (result) {
        socket.emit("note", result)
      } else {
        const obj = { content: "" }
        socket.emit("note", obj)
      }
    })
  })
  //============= STORE ====================
  socket.on("store", async (data) => {
    clearBuffer()
    await addToStore(data)
  })

  socket.on("check", async (data) => {
    clearBuffer()
    checkStore(data.token).then(async (result) => {
      if (result) {
        const obj = {
          exists: true,
          token: data.token,
          selected: data.selected,
        }
        socket.emit("check", obj)
      } else {
        const obj = {
          exists: false,
          selected: data.selected,
        }
        socket.emit("check", obj)
      }
    })
  })

  //============= LIVE ====================

  function startLive() {
    counter = setInterval(async () => {
      if (duration > 0) {
        clearBuffer()
        await io.volatile.emit("timer", --duration)

        if (duration <= 0) {
          await resetFlags()
          await clearClaps()
          await setLive(false)
          getStreamer().then(async (result) => {
            const obj = {
              isLive: false,
              state: 3,
              userId: result.userId,
            }
            io.to(obj.userId).emit("stream", obj)
            socket.broadcast.emit("live", obj)
            await remove()
            duration = 0
            clearInterval(counter)

            if ((await queueLength()) > 0) {
              stream(await queueNext())
            }
          })
        }
      }
    }, loop)
  }

  async function stream(data) {
    data.state = 2
    data.isLive = true

    await writeStreamer(data)
    switch (data.selected) {
      case "10":
        duration = 600
        break
      case "20":
        duration = 1200
        break
      case "30":
        duration = 1800
        break
      default:
        duration = 30
        break
    }

    await removeFromStore(data.token)
    await setLive(data.isLive)
    io.to(data.userId).emit("stream", data)
    socket.broadcast.emit("live", data)
    sendPos(data.userId)
    startLive()
  }

  function sendPos(Id) {
    queuePos(Id).then((result) => {
      if (result !== -1) {
        io.to(Id).emit("prompt", ++result)
      }
    })
  }

  function clearBuffer() {
    socket.sendBuffer = []
  }

  //============= COMMENT ====================
  socket.on("comment", async (data) => {
    clearBuffer()
    await io.emit("comment", data)
  })

  //============= DISCONNECT =================
  socket.on("disconnect", () => {
    let count = io.sockets.server.engine.clientsCount
    io.emit("online", count)
  })
}

module.exports = main
