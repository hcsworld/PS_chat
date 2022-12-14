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
const ID_NUM = 'id_num'
const MESSAGE_DATA = 'message_data'
const TYPE = 'type'
const AREA = 'area'
const SUBJECT = 'subject'
const STATUS = 'status'
const ROOM_NAME = 'room_name'

let USER_DATA = {

    'dlwns147' : {
        PW : '123456',
        ROLE : STUDENT,
        CHATROOM : {
            '인공지능' : {
                TYPE: 'area',
                NUMBER: 13,
            },
        }
    },

    'asdf' : {
        PW : '123456',
        ROLE : STUDENT,
        CHATROOM : {
            '오픈소스소프트웨어' : {
                TYPE: 'subject',
                NUMBER: 13,
            },
            '인공지능' : {
                TYPE: 'area',
                NUMBER: 13,
            },
        }
    },
}

let CHAT_ROOM_NAMES = {
    '오픈소스소프트웨어실습' : 'code1'
}

let CHAT_ROOM_CODES = {
    'code1' : {
        NAME: '오픈소스소프트웨어',
        TYPE: SUBJECT,
        PROF_COUNT: 0,
        STUDENT_COUNT: 0,
    }
}

let CHAT_DATA = {
    'OSSP' : [
        {
            ROLE : PROFESSOR,
            ID_NUM : 35,
            MESSAGE_DATA : 'Hi',
        },
        
        {
            ROLE : STUDENT,
            ID_NUM : 2,
            MESSAGE_DATA : 'Hello',
        }
    ],
}

const publicDirectoryPath = path.join(__dirname, 'public')
const app = express();

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const httpServer = http.createServer(app);
const options = {'serveClient': true}
// const io = new socketio.Server(server);
const io = socketio(httpServer, options);

app.get('/log_in', (req, res) => {
    console.log('/log_in')
    fs.readFile(path.join(__dirname, 'webpages', 'log_in.html'), (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 Error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html",
        credentials : "include",});
        res.end(data);
    })
});

app.get('/sign_up', (req, res) => {
    console.log('/sign_up')
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
    if (Object.keys(USER_DATA).includes(new_email)) {
        console.log("ID is duplicate")
        res.writeHead(409);
        res.end();
    }
    else {
        console.log("ID is not duplicate")
        res.writeHead(200);
        res.end();
        USER_DATA[new_email] = {
            PW : new_pw,
            ROLE : new_role,
            CHATROOM : {}
        }
    }
})

app.post('/main', (req, res) => {
    console.log(req.body);
    data = req.body
    let email = data.EMAIL
    let pw = data.PW

    if (Object.keys(USER_DATA).includes(email) && USER_DATA[email].PW === pw) {
        console.log('ID and PW are corrects')
        data = {
            EMAIL: email,
            ROLE: USER_DATA[email].ROLE,
            CHATROOM: USER_DATA[email].CHATROOM,
        }
        res.json(data)

    }
    else {
        console.log('ID and PW are not corrects')
        // res.writeHead(409);
        res.send({})
        res.end();
    }
})

app.get('/main', (req, res) => {
    console.log('main')

    fs.readFile(path.join(__dirname, 'webpages', 'main.html'), (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 Error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

app.post('/join', (req, res) => {
    console.log('join')
    // console.log(req.body)
    let data = req.body
    let join_room_code = data.CODE
    let join_email = data.EMAIL
    let role = data.ROLE
    // console.log('USER_DATA:\n' + JSON.stringify(USER_DATA[join_email]))
    // console.log('CHAT_ROOM_CODES:\n' + JSON.stringify(CHAT_ROOM_CODES[join_room_code]))
    // console.log('Object.keys(USER_DATA[join_email].CHATROOM\n' + Object.keys(USER_DATA[join_email].CHATROOM))
    // console.log('CHAT_ROOM_CODES[join_room_code].NAME\n' + CHAT_ROOM_CODES[join_room_code].NAME)

    // code is not in CHAT_ROOM_CODES or current user already in chatroom
    if (!Object.keys(CHAT_ROOM_CODES).includes(join_room_code) || 
        Object.keys(USER_DATA[join_email].CHATROOM).includes(CHAT_ROOM_CODES[join_room_code].NAME)) {
        res.json({STATUS: 409})
    }
    else {
        CHAT_ROOM_CODES[join_room_code].PROF_COUNT += (role === PROFESSOR ? 1 : 0)
        CHAT_ROOM_CODES[join_room_code].STUDENT_COUNT += (role === STUDENT ? 1 : 0)
        let id_num = (role === PROFESSOR ? CHAT_ROOM_CODES[join_room_code].PROF_COUNT : CHAT_ROOM_CODES[join_room_code].STUDENT_COUNT)
        USER_DATA[join_email].CHATROOM[CHAT_ROOM_CODES[join_room_code].NAME] = {
            TYPE : CHAT_ROOM_CODES[join_room_code].TYPE,
            NUMBER : id_num,
        }
        let data = {
            STATUS: 200,
            VALUE: USER_DATA[join_email].CHATROOM
        }
        res.json(data)

    }

    if (Object.keys(USER_DATA).includes(join_email)) {
        console.log(USER_DATA[join_email])
        console.log(CHAT_ROOM_CODES[join_room_code].NAME)
        // if (Object.keys(USER_DATA[join_email]).includes(CHAT_ROOM_CODES[join_room_code].NAME)) {
        //     CHAT_ROOM_CODES[join_room_code].role += 1
        //     USER_DATA[join_email]
        //     data = {

        //     }
        // }
    }
})

app.get('/create', (req, res) => {
    console.log('/create')
    fs.readFile(path.join(__dirname, 'webpages', 'create_chatroom.html'), (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 Error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    })
})

app.post('/create', (req, res) => {
    console.log('/create, post')
    let data = req.body
    console.log('data:\n' + JSON.stringify(data))
    let email = data.EMAIL
    let role = data.ROLE
    let room_name = data.ROOM_NAME
    let code = data.CODE
    let type = data.TYPE
    
    let res_data = {}
    if (Object.keys(CHAT_ROOM_CODES).includes(code) || Object.keys(CHAT_ROOM_NAMES).includes(room_name)) {
        res_data.STATUS = 409
    }
    else {
        CHAT_ROOM_CODES[code] = {
            NAME: room_name,
            TYPE : type,
            PROF_COUNT: 0 + (role === PROFESSOR ? 1 : 0),
            STUDENT_COUNT: 0 + (role === STUDENT ? 1 : 0),
        }
        CHAT_ROOM_NAMES[room_name] = code
        CHAT_DATA[room_name] = []
        // console.log(JSON.stringify(USER_DATA[email]))
        USER_DATA[email].CHATROOM[room_name] = {
            TYPE: type,
            NUMBER: (role === PROFESSOR ? CHAT_ROOM_CODES[code].PROF_COUNT : CHAT_ROOM_CODES[code].STUDENT_COUNT)
        }
        res_data.STATUS = 200
        res_data.CHATROOM = USER_DATA[email].CHATROOM
    }
    // console.log('USER_DATA[email]:\n' + USER_DATA[email])
    // console.log('CHAT_ROOM_NAMES:\n' + CHAT_ROOM_NAMES)
    // console.log('CHAT_ROOM_CODES[code]:\n' + CHAT_ROOM_CODES[code])
    res.json(res_data)
})

app.post('/chat', (req, res) => {
    console.log('chat, post')

    let data = req.body
    let email = data.EMAIL
    let room_name = data.ROOM_NAME

    let id_num = USER_DATA[email].CHATROOM[room_name].NUMBER
    let role = USER_DATA[email].ROLE

    let chat_data = CHAT_DATA[room_name]
    // console.log('chat_data :\n' + chat_data)
    let send_data = {
        EMAIL: email,
        ROLE : role,
        ID_NUM : id_num,
        ROOM_NAME : room_name,
        CHAT_DATA: chat_data,
    }
    res.json(send_data)
    
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

app.post("/exit", (req, res) => {
    console.log("exit, post")
    
    let data = req.body
    let email = data.EMAIL
    let room_name = data.ROOM_NAME
    // console.log('email : '+ email)
    // console.log('room_name : '+ room_name)

    delete USER_DATA[email].CHATROOM[room_name]
    res.json(USER_DATA[email].CHATROOM)
})

// app.post("/log_out", (req, res) => {
//     console.log("log_out")

//     let data = req.body
// }

// first connection on server
io.on('connection', (socket) => {

    socket.on("chat", (data) => {
        console.log('data : ' + JSON.stringify(data))
        let room_name = data.ROOM_NAME
        let send_id_num = data.ID_NUM
        let send_role = data.ROLE
        let message = data.MESSAGE

        console.log("room_name : " + room_name)

        CHAT_DATA[room_name].push({
            ROLE: send_role,
            ID_NUM: send_id_num,
            MESSAGE_DATA: message
        })
        io.emit("new_chat", {
            ROOM_NAME: room_name,
            CHAT_DATA: CHAT_DATA[room_name],
        })
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
