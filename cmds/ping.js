const { send } = require("process")

module.exports.run = async (client, message) => {
    let msg = await message.channel.send('PInging...')
    msg.edit(`Pong!\n\`Latency\`: ${msg.createdAt - message.createdAt}ms`)
}
module.exports.conf = {
    aliases: ['pong']
}