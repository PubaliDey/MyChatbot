const chatInput= document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;
const createChatLi = (message, className) => {
    //create a chat <li> elemengt with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions =
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify
        (
            {
               model: "gpt-3.5-turbo",
               messages: [{role: "user",content: userMessage}] 
            }
        )
    }
    //send POST requrest to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) =>{
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Try again.";
    }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value ="";
    chatInput.style.height = `${inputInitHeight}px`;//resize the textarea into original size after message is sent
    //append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);
    setTimeout(() => {
        //display thinking while waiting for response
        const incomingChatLi= createChatLi("Thinking..","incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}
chatInput.addEventListener("input",() =>
{
    //Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height`${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown",(e) =>
{
    //if enter key is pressed without shift key and the window width is greater than 800px then handle chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth >800)
    {
        e.preventDefault();
        handleChat();
    }
});
chatbotToggler.addEventListener("click",()=> document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click",()=> document.body.classList.remove("show-chatbot"));