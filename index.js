require("dotenv").config();
const login = require("fca-unofficial");


const facebookAccountCrenentials = {
    email : process.env.ACCOUNT_EMAIL,
    password : process.env.ACCOUNT_PASSWORD
}
console.log(facebookAccountCrenentials)
// Create simple echo bot
login(facebookAccountCrenentials , (err, api) => {
    if(err) return console.error(err);
 
    api.listen((err, message) => {
        api.sendMessage(message.body, message.threadID);
    });
});