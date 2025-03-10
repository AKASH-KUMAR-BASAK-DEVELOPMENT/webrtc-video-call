const socket = io();
let peerConnection;
const config = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Google's Free STUN Server
        { urls: "stun:bn-turn1.xirsys.com" }, // Xirsys STUN Server
        { 
        username: "OeOo5cLFA1JwcbpHhuQSfMFWzjaWxstmwcQi774fJo5RLCiUqOFkRRQ7Kes3ALyUAAAAAGel9bNBS0FTSC1Y",
        credential: "072fd90a-e54b-11ef-ac67-0242ac140004",
        urls: [
            "turn:bn-turn1.xirsys.com:80?transport=udp",
            "turn:bn-turn1.xirsys.com:3478?transport=udp",
            "turn:bn-turn1.xirsys.com:80?transport=tcp",
            "turn:bn-turn1.xirsys.com:3478?transport=tcp",
            "turns:bn-turn1.xirsys.com:443?transport=tcp",
            "turns:bn-turn1.xirsys.com:5349?transport=tcp"
        ]
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