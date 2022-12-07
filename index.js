require("dotenv").config();
const login = require("fca-unofficial");
const fs = require("fs");
const {Configuration, OpenAIApi} = require("openai");

//custom library for my personal functions
const {
    returnBotTypingTimeInSeconds,
    checkIfBotName
} = require("./functions.js");

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;


const configuration = new Configuration({
    apiKey: OPEN_AI_API_KEY
});
const openai = new OpenAIApi(configuration);


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
                        openai.createCompletion({
                          model: "text-davinci-003",
                          prompt: message,
                          temperature: 0.1,
                          "max_tokens": 2048
                        })
                        .then(response => response.data.choices[0].text)
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
                    openai.createCompletion({
                      model: "text-davinci-003",
                      prompt: event.body,
                      temperature: 0.1,
                      "max_tokens": 2048
                    })
                    .then(response => response.data.choices[0].text)
                    .then(response => {
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