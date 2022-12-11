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
.then(({ChatGPTAPI}) => {
    const _chatgptInstance = new ChatGPTAPI({
        sessionToken : process.env.SESSION_TOKEN
    })
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
                    api.markAsRead(event.threadID, (err) => {
                        if(err) return console.log(err);
                    });
                    if(event.body) {
                        if(event.isGroup) {
                            checkIfBotName(event.body)
                            .then(message => {
                                api.sendTypingIndicator(event.threadID, err => {if(err) return console.log(err)})
                                //AI response
                                _chatgptInstance.sendMessage(message)
                                .then(response => {
                                    if(response.length > 0) {
                                        setTimeout(() => api.sendMessage(response, event.threadID , event.messageID), returnBotTypingTimeInSeconds(response.length));
                                    }
                                    else {
                                        setTimeout(() => api.sendMessage(response, event.threadID , event.messageID), 3000);
                                    }
                                })
                                .catch(err => {return console.log(err)})
                            })
                            .catch(err => {return console.log(err)})
                        }
                        else {
                            api.sendTypingIndicator(event.threadID, err => {if(err) return console.log(err)})
                            //AI response
                            _chatgptInstance.sendMessage(event.body).then(response => {
                                if(response.length > 0) {
                                    setTimeout(() => api.sendMessage(response, event.threadID , event.messageID), returnBotTypingTimeInSeconds(response.length));
                                }
                                else {
                                    setTimeout(() => api.sendMessage(response, event.threadID , event.messageID), 3000);
                                }
                            })
                            .catch(err => {return console.log(err)})
                        }
                    }
                }
            });
        });
    }).catch(err => console.log(err))    
})
.catch(err => console.log(err))
