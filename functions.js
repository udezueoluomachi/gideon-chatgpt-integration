"use strict";

const _exports = module.exports

_exports.returnBotTypingTimeInSeconds = function (textLength) {
    let typingSpeed = 56;
    let typingTimeInMinutes = ((textLength / typingSpeed));
    return typingTimeInMinutes * 1000
};