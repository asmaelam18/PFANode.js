const socket = io('http://localhost:3000');
const form = document.querySelector('form');
const messages = document.querySelector('.messages');
const contacts = document.querySelector('.contacts');

let user;
let newMessage;

let newUser;
let newReceiver = {};
let receiver;


form.addEventListener('submit', processForm);

let message_send = "message-send";
let message_rcv = "message-rcv"; 
let status_connected = "status-connected";
let status_disconnected = "status-disconnected";



function processForm(e){

    if(e.preventDefault)
        e.preventDefault();

    let message = form.elements['message'].value;

    newMessage = {
        message : message,
        sender : user,
        receiver : newReceiver
    }

    socket.emit('newMessage', newMessage);

    let p = document.createElement('p');
    p.innerHTML = message;
    let div = document.createElement('div');

    
    div.className = "message "+message_send;

    div.append(p);
    messages.append(div);
}


socket.on('user', use => {
    user = use;
})

socket.on('friends', friends => {


    friends.forEach(friend => {
    let contactlink = document.createElement('a')
    contactlink.className = 'contactlink';
    contactlink.href = "#"
    let div = document.createElement('div');
    div.className = 'contact';
    let h1 = document.createElement('h1');
    h1.className = 'name';
    newUser = friend[0];
    h1.innerHTML = newUser.username;
    contactlink.addEventListener('click', () => {
        
        socket.emit('usernametoget', h1.innerHTML);
        socket.emit('getmessages', {user1 : user, user2 : newReceiver});
        
    })

   
    let statusdiv = document.createElement('div');
    statusdiv.className = 'status ' + status_disconnected;

    div.append(h1);
    div.append(statusdiv);    
    contactlink.append(div);
    contacts.append(contactlink);
    });

    
});
    

socket.on('receiver', receiver => {
    newReceiver.id = receiver._id;
    newReceiver.email = receiver.email;
    newReceiver.username = receiver.username;
    newReceiver.password = receiver.password;
});


socket.on('message', message => {
    console.log('message recieved')

    console.log(message.receiver)
    console.log(user)
    if(message.receiver.username == user.username){
        console.log('in');
        appendIntoMessages(message);
    }
        
})



socket.on('msgs', msgs => {

    refreshMessages();

    msgs.sort((a,b) => new Date(a.date) - new Date(b.date));
    msgs.forEach(message => {
        let div = document.createElement('div');
        
        let p = document.createElement('p');
        if(message.sent === false && message.rcv === true)
            div.className = 'message '+ message_rcv;
        else if(message.sent === true && message.rcv === false)
            div.className = 'message '+ message_send;
        
    
        p.innerHTML = message.message;

        div.append(p);
        messages.append(div)
    })

    console.log(msgs);
})

function refreshMessages(){
    messages.innerHTML = '';
}

function appendIntoMessages(message){
    let div = document.createElement('div');
        
        let p = document.createElement('p');
        
        div.className = 'message '+ message_rcv;
        

    
        p.innerHTML = message.message;


        div.append(p);
        messages.append(div)
}



