import mongoose, { Schema, model } from 'mongoose';
import encrypt from 'mongoose-encryption';
const encKey = process.env.SOME_32BYTE_BASE64_STRING;
const sigKey = process.env.SOME_64BYTE_BASE64_STRING;
if (!encKey)
    throw new Error('Missing encryption key (SOME_32BYTE_BASE64_STRING) in environment variables!');
if (!sigKey)
    throw new Error('Missing signing key (SOME_64BYTE_BASE64_STRING) in environment variables!');
const TesterSchema = new Schema({
    enabled: { type: Boolean, required: true },
    date: { type: String },
}, { _id: false });
const DeveloperSchema = new Schema({
    enabled: { type: Boolean, required: true },
    date: { type: String },
}, { _id: false });
const RolesSchema = new Schema({
    Developer: DeveloperSchema,
    Tester: TesterSchema,
}, { _id: false });
const CredentialsSchema = new Schema({
    access_token: String,
    refresh_token: String,
    expires: String,
}, { _id: false });
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    lang: { type: String, default: 'en-US' },
    executedCommands: { type: Number, required: true, default: 0 },
    banned: { type: Boolean, default: false },
    roles: RolesSchema,
    credentials: { type: CredentialsSchema, required: false },
}, { collection: 'Users', timestamps: true }).plugin(encrypt, {
    encryptionKey: encKey,
    signingKey: sigKey,
    encryptedFields: ['credentials'],
});
export default model('Users', UserSchema);
//# sourceMappingURL=user.js.map