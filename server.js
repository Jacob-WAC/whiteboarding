// server.js
const express = require("express");

const app = express();

const server = app.listen(8000, () =>
    console.log("The server is all fired up on port 8000")
);

// To initialize the socket, we need to
// invoke the socket.io library
// and pass it our Express server
const io = require("socket.io")(server, { cors: true });

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("draw", (data) => {
        console.log("emitting", data);
        socket.broadcast.emit("drawing", data);
    });

    socket.on("startDraw", (data) => {
        console.log("emitting", data);
        socket.broadcast.emit("startDraw", data);
    });

    socket.on("endDraw", (data) => {
        console.log("emitting", data);
        socket.broadcast.emit("endDraw", data);
    });

    socket.on("clear", (data) => {
        console.log("emitting", data);
        socket.broadcast.emit("clear", data);
    });

    socket.on("message", (msg) => {
        console.log("i got it! " + msg);
        io.emit("send msg", msg);
    });
});
