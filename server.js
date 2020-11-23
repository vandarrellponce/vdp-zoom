const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const http = require('http')
const { v4: uuidv4 } = require('uuid')

const { PeerServer } = require('peer')
const peerServer = PeerServer({ debug: true })

// APP CONFIG
dotenv.config()
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())

const server = http.Server(app)
const io = require('socket.io')(server)

app.use('/peerjs', peerServer)

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// DATBASE CONNECTION
/* connectDB() */

// SOCKET CONNECTION
io.on('connection', (socket) => {
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId)
		socket.to(roomId).broadcast.emit('user-connected', userId)
	})
})

// VIEW ENGINE
app.set('view engine', 'ejs')

// SET UP APP
app.use(express.static('public'))

// ROUTES
app.get('/', (_, res) => {
	res.redirect(`/${uuidv4()}`)
})

app.get('/:roomId', (req, res) => {
	res.render('room', { roomId: req.params.roomId })
})

// PORT CONFIG
const port = process.env.PORT || 5005
server.listen(port, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${port}`
	)
})
