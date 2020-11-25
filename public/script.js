const socket = io('/')
const peer = new Peer(/* undefined, {
	path: '/',
	host: '/',
	port: 5002,
} */)
let myVideoStream

// DOM Elements
const myVideo = document.createElement('video')
myVideo.muted = true
const videoGrid = document.getElementById('video-grid')

// PEER AND SOCKET CONNECTIONS
peer.on('open', (userId) => {
	socket.emit('join-room', roomId, userId)
	console.log('peer-on-open', userId)
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
			console.log('peer-on-call')
			call.answer(stream)
			const video = document.createElement('video')
			call.on(
				'stream',
				(userVideoStream) => {
					console.log('call-on-stream 1')
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
			console.log('call-on-stream 2')
			addVideoStream(video, userVideoStream)
		},
		function (err) {
			console.log('Failed to get local stream', err)
		}
	)

	console.log('connect to new user')
}

const scrollToBottom = () => {
	let chatWindow = $('.main__chat__window')
	chatWindow.scrollTop(chatWindow.prop('scrollHeight'))
}

const setMuteButton = () => {
	const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
	document.querySelector('.main__mute__button').innerHTML = html
}

const setUnmuteButton = () => {
	const html = `<i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
	document.querySelector('.main__mute__button').innerHTML = html
}

const toggleAudio = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled
	if (enabled) {
		myVideoStream.getAudioTracks()[0].enabled = false
		setUnmuteButton()
	} else {
		myVideoStream.getAudioTracks()[0].enabled = true
		setMuteButton()
	}
}

const setPlayVideo = () => {
	const html = `<i class="unmute fas fa-video-slash"></i>
    <span>Play Video</>
    `
	document.querySelector('.main__video__button').innerHTML = html
}

const setStopVideo = () => {
	const html = `<i class="fas fa-video"></i>
    <span>Stop Video</>
    `
	document.querySelector('.main__video__button').innerHTML = html
}

const toggleVideo = () => {
	let enabled = myVideoStream.getVideoTracks()[0].enabled
	if (enabled) {
		myVideoStream.getVideoTracks()[0].enabled = false
		setPlayVideo()
	} else {
		myVideoStream.getVideoTracks()[0].enabled = true
		setStopVideo()
	}
}

// MESSAGING

let text = $('input')

$('html').keydown((e) => {
	if (e.which == 13 && text.val().length !== 0) {
		console.log(text.val())
		socket.emit('message', text.val())
		text.val('')
	}
})

socket.on('createMessage', (message) => {
	$('.messages').append(
		`<li class='message' ><b style="color: skyblue">Participant</b><br/>${message}</li>`
	)
	scrollToBottom()
})
