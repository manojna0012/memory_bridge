function toggleChat(){
let body = document.getElementById("chat-body")

if(body.style.display === "none" || body.style.display === ""){
body.style.display = "block"
}else{
body.style.display = "none"
}
}


// SEND MESSAGE
async function sendMessage(){

let input = document.getElementById("chat-input")
let message = input.value.trim()

if(message === "") return

let messages = document.getElementById("chat-messages")

messages.innerHTML += "<p><b>You:</b> "+message+"</p>"

input.value = ""

// show typing indicator
messages.innerHTML += "<p id='typing'><i>Bot is thinking...</i></p>"
messages.scrollTop = messages.scrollHeight

try{

let response = await fetch("/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message:message})
})

let data = await response.json()

// remove typing message
document.getElementById("typing").remove()

messages.innerHTML += "<p><b>Bot:</b> "+data.reply+"</p>"

// TEXT TO SPEECH
let speech = new SpeechSynthesisUtterance(data.reply)
speech.lang = "en-US"
speech.rate = 0.9
window.speechSynthesis.speak(speech)

messages.scrollTop = messages.scrollHeight

}catch(error){

document.getElementById("typing").remove()
messages.innerHTML += "<p><b>Bot:</b> Sorry, I couldn't respond.</p>"

}

}


// ENTER KEY SEND
document.getElementById("chat-input").addEventListener("keypress", function(e){
if(e.key === "Enter"){
sendMessage()
}
})


// VOICE INPUT
function startVoice(){

let recognition = new webkitSpeechRecognition()
recognition.lang = "en-US"

recognition.onresult = function(event){
let transcript = event.results[0][0].transcript
document.getElementById("chat-input").value = transcript
sendMessage()
}

recognition.start()

}