require("dotenv").config();
const login = require("fca-unofficial");
const fs = require("fs");
const {Configuration, OpenAIApi} = require("openai");

//custom library for my personal functions
const {returnBotTypingTimeInSeconds} = require("./functions.js");

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

    api.setOptions({listenEvents: true});

    var listenEmitter = api.listen((err, event) => {
        if(err) return console.error(err);
        
        if (event.type === "message" || event.type === "message_reply") {
            api.markAsRead(event.threadID, (err) => {
                if(err) return console.log(err);
            });
            if(event.body) {
                api.sendTypingIndicator(event.threadID, err => {if(err) return console.log(err)})
                openai.createCompletion({
                  model: "text-davinci-003",
                  prompt: event.body,
                  temperature: 0.2,
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
    });
});