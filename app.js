const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`server on port ${PORT}`));
const io = require('socket.io')(server);

//dirman the current directory
app.use(express.static(path.join(__dirname,  'public')))

let socketsConnected = new Set() //Initializing

io.on('connection',onConnected)

 function onConnected(socket) {
    console.log(socket.id)
    socketsConnected.add(socket)


    socket.on('disconnect',() =>{
        console.log('Socket disconnected', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })  //This code handles client disconnections. 
    //It logs the event, updates the server's internal state to reflect the reduced number of connected clients,
    // and broadcasts the updated client count to all remaining clients
    
    io.emit('clients-total',socketsConnected.size)
    socket.on('message',(data) =>{
        console.log(data)
        socket.broadcast.emit('chat-message', data)
     }) //This code It keeps track of connected users,
        // listens for incoming messages from clients, 
        //and broadcasts those messages to all other connected clients
     

     socket.on('feedback',(data) =>{
        socket.broadcast.emit('feedback', data)
     })
 }
