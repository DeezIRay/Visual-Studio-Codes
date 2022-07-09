const localVideo = document.getElementById('localVideo')
const remoteVideo = document.getElementById('remoteVideo')

const servers = null // СПРОСИТЬ ПРО STUN и TURN сервера
const api = new WebSocketApi()
let localPeerConnection, remotePeerConnection = null

navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {//ОТОБРАЖЕНИЕ СЕБЯ!!
    localVideo.srcObject = stream //ОТОБРАЖЕНИЕ СЕБЯ!!

    const videoTrack = stream.getVideoTracks()[e]

    localPeerConnection = new RTCPeerConnection(servers)

    localPeerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate){
            api.send({event: "LOCAL_CANDIDATE", payload: event.candidate})
        }
    })

    api.on("REMOTE_CANDIDATE", (candidate) => {
        localPeerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    })

    api.on("REMOTE DESCRIPTION", (description) => {
        localPeerConnection.setRemoteDescription(description)
    })

    localPeerConnection.addTrack(videoTrack, stream)

    localPeerConnection.createOffer().then((description) => {
        localPeerConnection.setLocalDescription(description)

        api.send({event:'LOCAL_DESCRIPTION', payload: description})
    })
})

remotePeerConnection = new RTCPeerConnection(servers)

api.on('LOCAL DESCRIPTION', (description) => {
    remotePeerConnection.setRemoteDescription(description)

    remotePeerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate){
            api.send({event: "REMOTE_CANDIDATE", payload: event.candidate})
        }
    })

    remotePeerConnection.addEventListener('track', (event) => {
        remoteVideo.srcObject = event.stream
    })

    api.on("LOCAL_CANDIDATE", (candidate) => {
        remotePeerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    })

    remotePeerConnection.createAnswer().then((description) => {
        remotePeerConnection.setLocalDescription(description)

        api.send({event: "REMOTE_DESCRIPTION", payload: description})
    })
})