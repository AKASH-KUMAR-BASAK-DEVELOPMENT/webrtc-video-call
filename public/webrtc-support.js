const socket = io();
let peerConnection;
const config = {
    iceServers: [
        {
            urls: [
                'turn:54.253.139.90:3478',
                'turns:54.253.139.90:5349'
            ],
            username: "dummyuser",
            credential: "dummyPassword"
        }
    ]
};


    async function startCall() {
        try {
            peerConnection = new RTCPeerConnection(config);

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById("localVideo").srcObject = stream;
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('candidate', event.candidate);
                }
            };

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('offer', offer);
            } catch (error) {
                console.error("Error accessing camera and microphone:", error);
            }
    }


    socket.on('answer', async (answer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('candidate', (candidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
