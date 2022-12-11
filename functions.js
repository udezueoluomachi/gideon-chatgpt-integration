"use strict";

export const returnBotTypingTimeInSeconds = function (textLength) {
    let typingSpeed = 56;
    let typingTimeInMinutes = ((textLength / typingSpeed));
    return typingTimeInMinutes * 6000
};

export const checkIfBotName = function(message) {
    const botNameSearch = new RegExp("gideon","gi");
    message = message.replace(/\p{Extended_Pictographic}/gu, "");
    return new Promise(function (resolve, reject) {
    
        if( message.search(botNameSearch) != -1 && message.search(botNameSearch) < 2 ) {
            message = message.replace(/gideon/i, "");
            resolve(message);
        }
        else {
            reject("Bot name not mentioned in message Text");
        }
    })
};