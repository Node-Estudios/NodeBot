const {
    Schema,
    model
} = require('mongoose');

const modelo = Schema({
    userID: { type: String, required: true },
}, {
    collection: 'BlackList'
})

module.exports = model('BlackList', modelo)