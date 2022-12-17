require("dotenv").config();
const login = require("fca-unofficial");
const fs = require("fs");

//custom library for my personal functions
const {
    returnBotTypingTimeInSeconds,
    checkIfBotName
} = require("./functions.js");


//const {ChatGPTAPI} = await import("chatgpt");
import("chatgpt")
.then(({ChatGPTAPI, getOpenAIAuth}) => {
    
    getOpenAIAuth({
        email: process.env.OPENAI_EMAIL,
        password: process.env.OPENAI_PASSWORD
    })
    .then((openAIAuth) => {
        const _chatgptInstance = new ChatGPTAPI({...openAIAuth})
        _chatgptInstance.ensureAuth().then(()=> {
            console.log("authenticated");
        
        
            const facebookAccountCrenentials = {
                appState: JSON.parse(fs.readFileSync('fbstate.json', 'utf8'))
            }
            login(facebookAccountCrenentials , (err, api) => {
                if(err) return console.error(err);
                console.log("Bot online\nHello, my name is Gideon")
                api.setOptions({listenEvents: true});
            
                var listenEmitter = api.listen((err, event) => {
                    if(err) return console.error(err);
                    
                    if (event.type === "message" || event.type === "message_reply") {
                        api.markAsRead(event.threadID,true , (err) => {
                            if(err) return console.log(err);
                        });
                        if(event.body) {
                            if(event.isGroup) {
                                checkIfBotName(event.body)
                                .then(message => {
                                    //AI response
                                    _chatgptInstance.sendMessage(message)
                                    .then(response => {
                                        api.sendTypingIndicator(event.threadID, err => {if(err) return console.log(err)})
                                        if(response.length > 0) {
                                            setTimeout(() => api.sendMessage(response, event.threadID , event.messageID), returnBotTypingTimeInSeconds(response.length));
                                        }
                                        else {
                                            setTimeout(() => api.sendMessage(response, event.threadID , event.messageID), 3000);
                                        }
                                    })
                                    .catch(err => {
                                        setTimeout(() => api.sendMessage("Unfortunately, an error occured", event.threadID , event.messageID), 3000);
                                        return console.log(err)
                                    })
                                })
                                .catch(err => {return console.log(err)})
                            }
                            else {
                                //AI response
                                _chatgptInstance.sendMessage(event.body).then(response => {
                                    api.sendTypingIndicator(event.threadID, err => {if(err) return console.log(err)})
                                    if(response.length > 0) {
                                        setTimeout(() => api.sendMessage(response, event.threadID , event.messageID), returnBotTypingTimeInSeconds(response.length));
                                    }
                                    else {
                                        setTimeout(() => api.sendMessage(response, event.threadID , event.messageID), 3000);
                                    }
                                })
                                .catch(err => {
                                    setTimeout(() => api.sendMessage("Unfortunately, an error occured", event.threadID , event.messageID), 3000);
                                    return console.log(err)
                                })
                            }
                        }
                    }
                });
            });
        }).catch(err => console.log(err))
    }).catch(err => console.log("Failed to getopenAiAuth, \n%s", err))
})
.catch(err => console.log(err))
