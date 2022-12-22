const { Schema, model } = require('mongoose');

const modelo = Schema({
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    channelID: { type: String, required: true },
    messages: { type: Array, required: true },
    webhookURL: { type: String, required: true },
}, {
    collection: "modMails"
})

module.exports = model('modMails', modelo)
