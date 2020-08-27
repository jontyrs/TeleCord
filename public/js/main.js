const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// Get username and room from URL;
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join room
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down on new mssg;
    chatMessage.scrollTop = chatMessage.scrollHeight;

});

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // Emit chat message to server;
    socket.emit('chatMessage', msg);

    // Clear the mssg
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerHTML = room;
}
    
function outputUsers(users) {
    usersList.innerHTML = `
    ${users.map(user => `<li> ${user.username} </li>`).join('')}
    `;
}