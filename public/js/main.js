const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');

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
    <p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}