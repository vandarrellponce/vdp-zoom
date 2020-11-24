import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'

import { PeerServer } from 'peer'
const peerServer = PeerServer({ debug: true })

// APP CONFIG
dotenv.config()
const app = express()
app.use(cors())

const server = http.Server(app)

app.use('/', peerServer)

// PORT CONFIG
const port = process.env.PEER_PORT || 5005
server.listen(port, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${port}`
	)
})
