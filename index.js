require('dotenv').config()
const {
  Client,
  Collection
} = require('discord.js');
const spell = require("spell-checker-js");
const client = new Client();
const prefix = '.'
spell.load("en");
client.commands = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();

(require('./src/functions'))(client);

client.on('ready', async () => {
  await client.onReady();
  console.log('Beep boop')
})

client.on('message', (message) => {
  if (message.author.id == client.user.id) return;
  if (!message.guild) return;
  if (message.content.indexOf(prefix) != 0) {
    // Checking text
    const check = spell.check(message.content);
    
    if(check.length > 0) message.channel.send(`You misspelled: \`${check.join(', ')}\``)
  } else {
    let args = message.content.split(' ');
    let cmd = args.splice(0, 1)[0].substring(prefix.length).toLowerCase()
    if (client.commands.has(cmd)) {
      let highestTime = 0;
      if(client.cooldowns.has(message.author.id)) highestTime = client.cooldowns.get(message.author.id)
      if(client.cooldowns.has(message.channel.id)) if(highestTime < client.cooldowns.get(message.channel.id)) highestTime = client.cooldowns.get(message.channel.id)
      if(client.cooldowns.has(message.guild.id)) if(highestTime < client.cooldowns.get(message.guild.id)) highestTime = client.cooldowns.get(message.guild.id)
      if(highestTime > Date.now()) return message.channel.send(`That command is on cooldown for another ${highestTime-Date.now()}ms`)
      let command = client.commands.get(cmd);
      if(command.conf.cooldowns){
        if(command.conf.cooldowns.user) client.cooldowns.set(message.author.id, Date.now() + command.conf.cooldowns.user*1000)
        if(command.conf.cooldowns.channel) client.cooldowns.set(message.channel.id, Date.now() + command.conf.cooldowns.channel*1000)
        if(command.conf.cooldowns.guild) client.cooldowns.set(message.guild.id, Date.now() + command.conf.cooldowns.guild*1000)
      }
      client.commands.get(cmd).run(client, message, args)
    } else if (client.aliases.has(cmd)) {
      client.aliases.get(cmd).run(client, message, args)
    }
      
  }
})

client.login(process.env.token)