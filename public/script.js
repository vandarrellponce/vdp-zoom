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

const main = async () => {
	const stream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	})

	addVideoStream(myVideo, stream)
}

main()
