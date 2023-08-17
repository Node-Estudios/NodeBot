import cachedCommands from './cache/commands.js'
const body = cachedCommands.cache.each((command) => { return command })
console.log(body)
fetch('https://discord.com/api/v9/applications/834164602694139985/guilds/862635336165097483/commands', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
    body: '[]',
}).then(() => console.log('Successfully registered application commands.'))
