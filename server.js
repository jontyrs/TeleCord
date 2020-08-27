const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');



const app = express();
const server = http.createServer(app);
const io = socketio(server);




app.use(express.static(path.join(__dirname, 'public')));


// RUN WHEN CLIENT CONNECTS;
io.on('connection', socket => {
    // Welcome current User
    socket.emit('message', 'Welcome to telecord');

    // When a client joins the server;
    socket.broadcast.emit('message', 'A User has joined the Chat');

    // Run when client disconnects;
    socket.on('disconnect', () => {
        io.emit('message', 'A User disconnected');
    });
});




const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});