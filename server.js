import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/db.js'
import errorHandler from './middlewares/errorHandler.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import http from 'http'
import { v4 as uuidv4 } from 'uuid'
import { Server } from 'socket.io'
import { ExpressPeerServer } from 'peer'

// APP CONFIG
dotenv.config()
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())

const server = http.Server(app)
const io = new Server(server)

const peerServer = ExpressPeerServer(server, { debug: true })
app.use('/peerjs', peerServer)

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// DATBASE CONNECTION
connectDB()

// SOCKET CONNECTION
io.on('connection', (socket) => {
	socket.on('join-room', (roomId) => {
		socket.join(roomId)
		socket.to(roomId).broadcast.emit('user-connected')
	})
})

// VIEW ENGINE
app.set('view engine', 'ejs')

// SET UP APP
app.use(express.static('public'))

// ROUTES
app.get('/', (req, res) => {
	res.redirect(`${uuidv4()}`)
})

app.get('/:roomId', (req, res) => {
	res.render('room', { roomId: req.params.roomId })
})

app.use('/api/users', userRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.all('*', (req, res) =>
	res.status(404).send({ message: `Not found - ${req.originalUrl}` })
)

// ERROR HANDLER
app.use(errorHandler)

// PORT CONFIG
const port = process.env.PORT || 5005
server.listen(port, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${port}`
	)
})
