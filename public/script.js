const socket = io('/')
const peer = new Peer(undefined, {
	path: '/',
	host: '/',
	port: '5001',
})
let myVideoStream

// DOM Elements
const myVideo = document.createElement('video')
myVideo.muted = true
const videoGrid = document.getElementById('video-grid')

// PEER AND SOCKET CONNECTIONS
peer.on('open', (userId) => {
	console.log(userId)
	socket.emit('join-room', roomId, userId)
})

navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		myVideoStream = stream
		addVideoStream(myVideo, stream)

		peer.on('call', (call) => {
			call.answer(stream)
			const video = document.createElement('video')
			call.on('stream', (userVideoStream) => {
				console.log('on stream 2')
				addVideoStream(video, userVideoStream)
			})
		})

		socket.on('user-connected', (userId) => {
			connectToNewUser(userId, stream)
		})
	})

// FUNCTIONS
const addVideoStream = (video, stream) => {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	videoGrid.append(video)
}

const connectToNewUser = (userId, stream) => {
	const call = peer.call(userId, stream)
	console.log(call)
	const video = document.createElement('video')
	call.on('stream', (userVideoStream) => {
		console.log('on stream 1')
		addVideoStream(video, userVideoStream)
	})

	console.log('hey')
}
