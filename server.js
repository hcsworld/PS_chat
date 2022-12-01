const path = require('path')
const express = require('express');
const socketio = require("socket.io");
const http = require('http');
const fs = require("fs");
const bodyParser = require('body-parser')
const port = 8000

const EMAIL = 'email'
const PW = 'password'
const ROLE = 'role'
const STUDENT = 'student'
const PROFESSOR = 'professor'
const CHAT_NUMS = 'chat_nums'
const ID_NUM = 'id_num'
const MESSAGE_DATA = 'message_data'

let ID_PW_DATA = {

    'dlwns147' : {
        PW : '123456',
        ROLE : STUDENT,
        CHAT_NUMS : {
            'OSSP' : 10
        }
    },

    'asdf' : {
        PW : '123456',
        ROLE : STUDENT,
        CHAT_NUMS : {
            'OSSP' : 10
        }
    },
}

let CHAT_DATA = {
    'OSSP' : [
        {
            ROLE : PROFESSOR,
            ID_NUM : 35,
            MESSAGE_DATA : 'Hi',
        },
        
        {
            ROLE : PROFESSOR,
            ID_NUM : 2,
            MESSAGE_DATA : 'Hello',
        }
    ],
    
    'OSSP' : [
        {
            ROLE : PROFESSOR,
            ID_NUM : 35,
            MESSAGE_DATA : 'Hi',
        },
        
        {
            ROLE : PROFESSOR,
            ID_NUM : 2,
            MESSAGE_DATA : 'Hello',
        }
    ]
}

const app = express();
const httpServer = http.createServer(app);
const options = {
    'serveClient': true
}
// const io = new socketio.Server(server);
const io = socketio(httpServer, options);

const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/log_in', (req, res) => {
    console.log('/log_in')
    // res.sendFile(__dirname + '/chatroom.html');
    // res.sendFile(path.join(publicDirectoryPath, 'webpages', 'chatroom.html'));

    fs.readFile(path.join(__dirname, 'webpages', 'log_in.html'), (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 Error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    })
});

app.get('/sign_up', (req, res) => {
    console.log('/sign_up')
    // res.sendFile(__dirname + '/chatroom.html');
    // res.sendFile(path.join(publicDirectoryPath, 'webpages', 'chatroom.html'));

    fs.readFile(path.join(__dirname, 'webpages', 'sign_up.html'), (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 Error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    })
});

app.post('/sign_up', (req, res) => {
    console.log(req.body);
    data = req.body
    new_email = data.EMAIL
    new_pw = data.PW
    new_role = data.ROLE
    let request_status;
    if (Object.keys(ID_PW_DATA).includes(new_email)) {
        console.log("ID is duplicate")
        res.writeHead(409);
        res.end();
    }
    else {
        console.log("ID is not duplicate")
        ID_PW_DATA[new_email] = {
            PW : new_pw,
            ROLE : new_role,
            CHAT_NUMS : {}
        }
        fs.readFile(path.join(__dirname, 'webpages', 'log_in.html'), (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).send("<h1>500 Error</h1>");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
})

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

    // socket.on("sign_up", (data, callback) => {
    //     console.log(data)
    //     callback({status : request_status})
    // })
    // console.log('a user connected');
});

httpServer.listen(port, () => {
    console.log('listening on *:' + port);
})
