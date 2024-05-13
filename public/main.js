
const socket = io("http://localhost:4000")

const clientsTotal = document.getElementById("client-total")
const messageContainer = document.getElementById("message-container")
const nameInput = document.getElementById("name-input")
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    sendMessage()
})


socket.on("clients-total", (data)=>{
    clientsTotal.innerText = `Total clients ${data}`
}) //this code listens for server updates about the total connected clients and dynamically 
//updates a UI element on the client-side to reflect that information


function sendMessage(){
    if(messageInput.value === '') return
    //console.log(messageInput.value)
    const data ={
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    }
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

socket.on('chat-message', (data)=>{
    //console.log(data)
    addMessageToUI(false, data)
}) //this code listens for incoming chat messages from the server. 
//When a message is received, it extracts the message data and calls another function (addMessageToUI) 
//to handle displaying the message on the user interface

function addMessageToUI(isOwnMessage, data){
    clearFeedback()
    const element = ` <li class="${isOwnMessage ? "message-right" : "message-left"}">
     <p class="message"> ${data.message}
       <span>${data.name} : ${moment(data.dateTime).fromNow()}</span>
</li>`

messageContainer.innerHTML += element
    //this function dynamically creates HTML elements for messages, 
//differentiates between the user's own messages and incoming messages, and adds them to the chat UI

scrollTOBottom()

}

function scrollTOBottom(){
    messageContainer.scrollTop(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value}  
        `
    })
})
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value}  `
    })
})
messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:'',
    })
})

socket.on('feedback',(data) =>{
    clearFeedback()
    const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">
    ${data.feedback} is typing...
    </p>`

 messageContainer.innerHTML += element
}) //This code displays incoming feedback messages 
//(likely indicating typing status of other users) in the chat interface


function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}
