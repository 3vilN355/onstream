module.exports.run = async (client, message, args) => {
    if(message.author.id != '136985027413147648') return;
    // await client.db.insert({beep:1})
    let res = eval(args.join(' '))
    await message.channel.send(res).catch(e => {});
    console.log(res);
}
module.exports.conf = {
    aliases: ['r']
}