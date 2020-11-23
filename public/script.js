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

const connectToNewUser = () => {
	console.log('there is a new user')
}

// SOCKET CONNECTION
socket.emit('join-room', roomId)
socket.on('user-connected', () => {
	console.log('there is a new user')
})

const main = async () => {
	const stream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	})

	addVideoStream(myVideo, stream)
}

main()
