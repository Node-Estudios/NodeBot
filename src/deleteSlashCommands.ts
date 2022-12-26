fetch('https://discord.com/api/v9/applications/963496530818506802/commands', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
    body: '[]',
}).then(() => console.log('Successfully registered application commands.'))
