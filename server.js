const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("offer", ({offer, targetId, callerId}) => {
        console.log("Received offer, sending to receiver...");
        socket.to(targetId).emit("offer",{ offer, callerId });
    });

    socket.on("answer", (answer) => {
        console.log("Received answer, sending to sender...");
        socket.broadcast.emit("answer", answer);
    });

    socket.on("candidate", (candidate) => {
        console.log("Received ICE candidate, relaying...");
        socket.broadcast.emit("candidate", candidate);
    });

    socket.on('endCall', () => {
        console.log('Call Ended');
        socket.broadcast.emit('endCall');
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log("Server running on http://localhost:3000");
});
