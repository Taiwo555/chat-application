
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
})

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
})

function addMessageToUI(isOwnMessage, data){
    clearFeedback()
    const element = ` <li class="${isOwnMessage ? "message-right" : "message-left"}">
     <p class="message"> ${data.message}
       <span>${data.name} : ${moment(data.dateTime).fromNow()}</span>
</li>`

messageContainer.innerHTML += element
    
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
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}