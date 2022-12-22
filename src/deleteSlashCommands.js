const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const rest = new REST({ version: '9'}).setToken('OTYzNDk2NTMwODE4NTA2ODAy.YlW8EQ.O8FAuuDt_LzHIAcEs2jS7Au5IwA')

createSlash()

async function createSlash() {
    try{
        const commands = []
        // await rest.put(
        //     Routes.applicationGuildCommands('819303846513737728', '862635336165097483'),
        //     { body: commands }
        // )
        await rest.put(
            Routes.applicationCommands('963496530818506802'),
            { body: commands }
        )
        console.log('Se han borrado los slash commands.')
    } catch(e) {
        console.error(e)
    }
}
