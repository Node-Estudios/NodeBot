const {
    Schema,
    model
} = require('mongoose');

const modelo = Schema({
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    categoryID: { type: String, required: true },
    channelID: { type: String, required: true },
    temporary: { type: Boolean, required: true }
}, {
    collection: "pvc"
})

module.exports = model('pvc', modelo)