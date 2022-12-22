const { Schema, model } = require('mongoose');

const modelo = Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true, default: "No hay descripción" },
    response: { type: String, required: true },
},
{
    collection: 'customCmds'
})

module.exports = model("customCmds", modelo);
