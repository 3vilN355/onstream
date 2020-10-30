const mutedRoleId = '771525076062437416'
const staffRoleId = '771526153147514951'

module.exports.run = async (client, message, [user, time, ...reason]) => {
    if(!message.member.roles.cache.has(staffRoleId)) return;
    let userID = user.match(/\d{17,19}/);
    if(!userID) return message.channel.send('Invalid 1st arg');
    userID = userID[0]
    // try to get user from guild
    let foundMember;
    if(message.guild.members.cache.has(userID)) foundMember = message.guild.members.cache.get(userID);
    else foundMember = await message.guild.members.fetch(userID).catch(e => {});
    if(!foundMember) return;

    if(foundMember.roles.cache.has(staffRoleId)) return message.channel.send('You cannot mute staff')
    let duration = time.match(/\d{1,3}/);
    if(!duration) return message.channel.send(`Invalid time`);
    duration = duration[0];

    let dbObj = {
        userID,
        staffID:message.author.id,
        guildID: message.guild.id,
        duration,
        endTime: Date.now()+duration*60000,
        isComplete: false,
    }
    let errored = false;
    await foundMember.roles.add(mutedRoleId).catch(e => {
        errored = true;
    })
    if(errored) return message.channel.send(`Error muting ${foundMember}`)
    await client.db.collection('mutes').insertOne(dbObj)
}
module.exports.undo = async (client, {
    userID,
    guildID,
    _id,
}) => {
    let guild = client.guilds.cache.get(guildID)
    let member;
    if (guild.members.cache.has(userID)){
        member = guild.members.cache.get(userID)
    } else {
        member = await guild.members.fetch(userID)
    }
    if(!member) return;

    await member.roles.remove(mutedRoleId).catch(e => {})

    await client.db.collection('mutes').updateOne({_id}, {$set:{isComplete: true}})
}
module.exports.conf = {
    aliases: ['m', 'silence'],
}