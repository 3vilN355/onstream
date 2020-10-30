const fs = require('fs/promises')
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'onstreambot';

module.exports = (client) => {
    client.onReady = async () => {
        let mongoClient;
        try {
            mongoClient = await MongoClient.connect(url, {useUnifiedTopology:true});

            client.db = mongoClient.db(dbName);
        } catch (err) {
            console.log(err.stack);
        }

        let cmds = await fs.readdir('cmds')
        cmds.forEach(cmd => {
            let ucmd = require(`../cmds/${cmd}`)
            client.commands.set(cmd.substring(0, cmd.indexOf('.')).toLowerCase(), ucmd)
            if (ucmd.conf?.aliases?.length > 0) {
            ucmd.conf.aliases.forEach(alias => client.aliases.set(alias, ucmd))
            }
        })

        setInterval(async () => {
            let unfinished = await client.db.collection('mutes').find({isComplete:false, endTime:{$lte: Date.now()}})
            unfinished.forEach(mute => {
                client.commands.get('mute').undo(client, mute)
            })
        }, 2000)
    }
}