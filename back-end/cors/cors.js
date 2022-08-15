const cors = require("cors")
/*const { instrument } = require("@socket.io/admin-ui")
instrument(io, {
  auth: false,
})*/

// @Cors     Allow all origins
// router.use(cors())
const corsConfig = {
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  origin: [
    "https://vebbo.herokuapp.com/",
    "https://vebbo.me",
    "https://vebbo.me/",
    "https://media-4e717.web.app/",
    "https://admin.socket.io",
    "https://admin.socket.io/",
  ],
  optionsSuccessStatus: 200,
}

const corsHeader = {
  origin: [
    "https://vebbo.herokuapp.com/",
    "https://vebbo.me",
    "https://vebbo.me/",
    "https://media-4e717.web.app/",
    "https://admin.socket.io",
    "https://admin.socket.io/",
  ],
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "X-Requested-With",
    "X-Access-Token",
    "Content-Type",
    "Host",
    "Accept",
    "Connection",
    "Cache-Control",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}

const config = cors(corsConfig)

module.exports = {
  config,
  corsHeader,
}
