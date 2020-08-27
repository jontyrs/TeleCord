const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');


const app = express();
const server = http.createServer(app);
// const io = socketio(server);
const io = socketio.listen(server);
const botName = 'TeleCord botName';



app.use(express.static(path.join(__dirname, 'public')));


// RUN WHEN CLIENT CONNECTS;
io.on('connection', socket => {
    // Welcome current User
    socket.emit('message', formatMessage(botName, 'Welcome to telecord'));

    // When a client joins the server;
    socket.broadcast.emit('message', formatMessage(botName, 'A User has joined the Chat'));

    // Run when client disconnects;
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A User disconnected'));
    });

    // Listen chat message;
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });


});




const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});