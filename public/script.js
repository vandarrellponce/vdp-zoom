const socket = io('/')
const peer = new Peer({
	host: '/',
	path: '/',
	port: '5002',
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
			call.on(
				'stream',
				(userVideoStream) => {
					console.log('on stream 2')
					addVideoStream(video, userVideoStream)
				},
				function (err) {
					console.log('Failed to get local stream', err)
				}
			)
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

const connectToNewUser = async (userId, stream) => {
	const call = await peer.call(userId, stream)
	const video = document.createElement('video')
	call.on(
		'stream',
		(userVideoStream) => {
			console.log('on stream 1')
			addVideoStream(video, userVideoStream)
		},
		function (err) {
			console.log('Failed to get local stream', err)
		}
	)

	console.log('connect to new user')
}
