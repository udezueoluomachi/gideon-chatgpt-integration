require("dotenv").config();
const login = require("fca-unofficial");
const fs = require("fs");


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
            setTimeout(() => api.sendMessage("You said: " + event.body, event.threadID , event.messageID), 3000)
        }
    });
});