const path = require('path')
const express = require('express');
const socketio = require("socket.io");
const http = require('http');
const port = 8000

const app = express();
const httpServer = http.createServer(app);
const options = {
    'serveClient': true
}
// const io = new socketio.Server(server);
const io = socketio(httpServer, options);

const publicDirectoryPath = path.join(__dirname, 'static')
app.use(express.static(publicDirectoryPath))


app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
    console.log('chat')
    // res.sendFile(__dirname + '/chatroom.html');
    res.sendFile(path.join(publicDirectoryPath, 'chatroom.html'));
});

// first connection on server
io.on('connection', (socket) => {
    // console.log('a user connected');
    console.log('socket :\n' + socket)
});

httpServer.listen(port, () => {
    console.log('listening on *:' + port);
});