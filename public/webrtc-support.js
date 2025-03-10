const socket = io();
let peerConnection;
const config = {
    iceServers: [
        {
            urls: [
                'turn:13.211.123.234:3478',      // Replace with your TURN server IP and port
                'turns:13.211.123.234:5349'      // Secure TURN (TLS)
            ],
            username: "dummyuser",   // Same dummy username
            credential: "dummyPassword"  // Same dummy password
        }
    ]
};


    async function startCall() {
        try {
            let targetId = prompt('Socket id: ');
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
            let socketId = socket.id;
            socket.emit('offer', {offer, targetId, callerId: socketId});
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

    socket.on("connect", () => {
        document.getElementById("socketId").innerText = socket.id;
    });