const fs = require("fs");
const express = require("express");
const https = require("https");
const { Server } = require("socket.io");

const app = express();

const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app);

const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("offer", (offer) => {
        console.log("Received offer, sending to receiver...");
        socket.broadcast.emit("offer", offer);
    });

    socket.on("answer", (answer) => {
        console.log("Received answer, sending to sender...");
        socket.broadcast.emit("answer", answer);
    });

    socket.on("candidate", (candidate) => {
        console.log("Received ICE candidate, relaying...");
        socket.broadcast.emit("candidate", candidate);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log("Server running on http://localhost:3000");
});