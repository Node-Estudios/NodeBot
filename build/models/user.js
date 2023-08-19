import mongoose, { Schema, model } from 'mongoose';
import encrypt from 'mongoose-encryption';
const Tester = new Schema({
    enabled: { type: Boolean, required: true },
    date: { type: String },
});
const Developer = new Schema({
    enabled: { type: Boolean, required: true },
    date: { type: String },
});
const Roles = new Schema({
    Developer,
    Tester,
});
const Credentials = new Schema({
    access_token: String,
    refresh_token: String,
    expires: String,
});
const encKey = process.env.SOME_32BYTE_BASE64_STRING;
const sigKey = process.env.SOME_64BYTE_BASE64_STRING;
export default model('Users', new mongoose.Schema({
    id: { type: String, required: true },
    lang: { type: String },
    executedCommands: { type: Number },
    banned: { type: Boolean },
    roles: Roles,
    credentials: { type: Credentials, required: false },
}, { collection: 'Users' }).plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['credentials'] }));
//# sourceMappingURL=user.js.map