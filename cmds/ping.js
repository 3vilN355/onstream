module.exports.run = async (client, message) => {
    let msg = await message.channel.send('PInging...')
    msg.edit(`Pong!\n\`Latency\`: ${msg.createdAt - message.createdAt}ms`)
}
module.exports.conf = {
    aliases: ['pong'],
    cooldowns: {
        channel: 2,
        user: 4,
        guild: 1,
    }
}