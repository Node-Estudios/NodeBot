import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

rest.put(Routes.applicationCommands('963496530818506802'), { body: [] })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
