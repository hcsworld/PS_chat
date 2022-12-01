const express = require('express');

const socket = require('socket.io');

const http = require('http');

const app = express();

const server = http.createServer(app);

const io = socket(server)

app.get('/', function (request, response) {
    console.log('유저가 /으로 접속하였습니다!');
    response.send('Hello, express Server!!');
})

server.listen(3000, function () {
    console.log('서버 실행 중..')
})