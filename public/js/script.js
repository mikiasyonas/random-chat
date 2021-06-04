let queryString = window.location.search;

let urlParams = new URLSearchParams(queryString);

let userName = urlParams.get('userName');

let uName = document.querySelector('.userName');
let userNameContent = document.querySelector('.startSearch');
let searchButton = document.querySelector('.searchMatch');
let view = document.querySelector('.view');
let chatPlace = document.querySelector('.chatSection');

var socket = io('http://localhost:3000');

socket.on('connect', () => {
    socket.on('welcome', (message) => {
        console.log(message.message);
        console.log(socket.id);
    });
    searchButton.addEventListener('click', () => {
        if(uName.value) {
            socket.emit('client_greeting', {
                userName: uName.value,
                message: "received"
            });

            uName.value = "";
            userNameContent.style.display = "none";
        } else {
            document.querySelector('.userNameLabel').innerHTML = "Please Enter User Name";
        }
    });

    // view.style.display = "none";
});