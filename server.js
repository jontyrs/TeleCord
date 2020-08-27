const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeaves, getUserRooms } = require('./utils/users');



const app = express();
const server = http.createServer(app);
// const io = socketio(server);
const io = socketio.listen(server);
const botName = 'TeleCord botName';



app.use(express.static(path.join(__dirname, 'public')));


// RUN WHEN CLIENT CONNECTS;
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome current User
        socket.emit('message', formatMessage(botName, 'Welcome to telecord'));
    
        // When a client joins the server;
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the Chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUserRooms(user.room)
        });
    });

    // Listen chat message;
    socket.on('chatMessage', msg => {
        const curUser = getCurrentUser(socket.id);
        io.to(curUser.room).emit('message', formatMessage(curUser.username, msg));
    });

    // Run when client disconnects;
    socket.on('disconnect', () => {

        const leftuser = userLeaves(socket.id);

        if(leftuser) {
            io.to(leftuser.room).emit('message', formatMessage(botName, `${leftuser.username} disconnected`));
            
            // Send users and room info
            io.to(leftuser.room).emit('roomUsers', {
                room: leftuser.room,
                users: getUserRooms(leftuser.room)
            });
        }
    });
});




const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});