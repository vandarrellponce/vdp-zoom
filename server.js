const express = require('express')
const dotenv = require('dotenv')

const http = require('http')

const { PeerServer } = require('peer')
const peerServer = PeerServer({ debug: true })

// APP CONFIG
dotenv.config()
const app = express()

const server = http.Server(app)

app.use('/peerjs', peerServer)

// PORT CONFIG
const port = process.env.PORT || 5005
server.listen(port, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${port}`
	)
})
