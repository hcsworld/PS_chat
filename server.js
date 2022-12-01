const path = require('path')
const express = require('express');
const socketio = require("socket.io");
const http = require('http');
const fs = require("fs");
const port = 8000

const app = express();
const httpServer = http.createServer(app);
const options = {
    'serveClient': true
}
// const io = new socketio.Server(server);
const io = socketio(httpServer, options);

const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))


app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html');
});

app.get('/main', (req, res) => {
    console.log('main')
    // res.sendFile(__dirname + '/chatroom.html');
    // res.sendFile(path.join(publicDirectoryPath, 'webpages', 'chatroom.html'));

    fs.readFile(path.join(__dirname, 'webpages', 'main.html'), (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 Error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

app.get('/chat', (req, res) => {
    console.log('chat')
    // res.sendFile(__dirname + '/chatroom.html');
    // res.sendFile(path.join(publicDirectoryPath, 'webpages', 'chatroom.html'));

    fs.readFile(path.join(__dirname, 'webpages', 'chatroom.html'), (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 Error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

// first connection on server
io.on('connection', (socket) => {
    socket.on("hello", (arg) => {

        console.log('socket :\n' + socket + "\n" + arg)
    })
    // console.log('a user connected');
});

httpServer.listen(port, () => {
    console.log('listening on *:' + port);
});