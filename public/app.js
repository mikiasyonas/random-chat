 const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const cors = require('cors');
dotenv.config();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));


const server = http.Server(app);
let io = socketIo(server);

var users = new Map();

io.on('connection', (socket) => {
    socket.emit('welcome', {
        message: "welcome to our Random Chat Website"
    });

    socket.on('client_greeting', (data) => {
        let userName = data.userName;
        
        var client = {
            id: socket.id,
            userName: userName,
            matched: false,
            online: true,
            matchedTo: null
        }

        users.set(socket.id, client);
    });

    socket.on('match_request', (data) => {
        let matches = users.filter(user => user.id != socket.id);

        console.table(matches);

    });
});


const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log(`server started at: ${ PORT }`);
});
