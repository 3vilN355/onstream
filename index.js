require('dotenv').config()
const {Client, Collection} = require('discord.js');
const client = new Client();
const prefix = '.'
const commands = new Collection();
const aliases = new Collection();
const fs = require('fs/promises')

client.on('ready', async () => {
    let cmds = await fs.readdir('cmds')
    cmds.forEach(cmd => {
        let ucmd = require(`./cmds/${cmd}`)
        commands.set(cmd.substring(0, cmd.indexOf('.')).toLowerCase(), ucmd)
        if(ucmd.conf?.aliases?.length > 0){
            ucmd.conf.aliases.forEach(alias => aliases.set(alias, ucmd))
        }
    })
    console.log('Beep boop')
})

client.on('message', (message) => {
    if(message.author.id == client.user.id) return;
    if(message.content.indexOf(prefix) != 0) return;
    let args = message.content.split(' ');
    console.log("args", args)
    let cmd = args.splice(0, 1)[0].substring(prefix.length).toLowerCase()
    console.log("cmd", cmd)
    if (commands.has(cmd)) {
        commands.get(cmd).run(client, message)
    } else if (aliases.has(cmd)){
        aliases.get(cmd).run(client, message)
    }
})

client.login(process.env.token)