const socket = io('/')
const peer = new Peer(undefined, {
	path: '/peerjs',
	host: '/',
	port: '5001',
})

// DOM Elements
const myVideo = document.createElement('video')
myVideo.muted = true
const videoGrid = document.getElementById('video-grid')

// FUNCTIONS
const addVideoStream = (video, stream) => {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	videoGrid.append(video)
}

const connectToNewUser = (userId) => {
	console.log(userId)
}

// PEER AND SOCKET CONNECTIONS
peer.on('open', (userId) => {
	socket.emit('join-room', roomId, userId)
})
socket.on('user-connected', (userId) => {
	connectToNewUser(userId)
})

const main = async () => {
	const stream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	})

	addVideoStream(myVideo, stream)
}

main()
