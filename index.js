require('dotenv').config()
const {Client} = require('discord.js');
const client = new Client();

client.on('ready', () => {
    console.log('Beep boop')
})

client.on('message', (message) => {
    if(message.author.id == client.user.id) return;
    message.reply('heyo')
})
client.login(process.env.token)