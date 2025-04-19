import mongoose, { Schema, model, Types } from 'mongoose' // Added Types import
import encrypt from 'mongoose-encryption'

// Define required environment variables and check them
const encKey = process.env.SOME_32BYTE_BASE64_STRING
const sigKey = process.env.SOME_64BYTE_BASE64_STRING

// Removed braces for single-statement 'if' blocks
if (!encKey)
    throw new Error('Missing encryption key (SOME_32BYTE_BASE64_STRING) in environment variables!')
if (!sigKey)
    throw new Error('Missing signing key (SOME_64BYTE_BASE64_STRING) in environment variables!')

// --- Sub-schema definitions ---
// Disabled warnings for schema constants used only within RolesSchema definition
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TesterSchema = new Schema({
    enabled: { type: Boolean, required: true },
    date: { type: String }, // Consider using Date type: { type: Date }
}, { _id: false })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DeveloperSchema = new Schema({
    enabled: { type: Boolean, required: true },
    date: { type: String }, // Consider using Date type: { type: Date }
}, { _id: false })

const RolesSchema = new Schema({
    Developer: DeveloperSchema,
    Tester: TesterSchema,
}, { _id: false }) // Remove trailing comma here if ESLint flagged line 26

const CredentialsSchema = new Schema({
    access_token: String,
    refresh_token: String,
    expires: String, // Consider using Date type: { type: Date }
}, { _id: false }) // Remove trailing comma here if ESLint flagged line 31

// --- Main Schema Definition ---
const UserSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        lang: { type: String, default: 'en-US' },
        executedCommands: { type: Number, required: true, default: 0 },
        banned: { type: Boolean, default: false },
        roles: RolesSchema,
        credentials: { type: CredentialsSchema, required: false },
    },
    { collection: 'Users', timestamps: true },
).plugin(encrypt, {
    encryptionKey: encKey,
    signingKey: sigKey,
    encryptedFields: ['credentials'],
})

// --- TypeScript Interfaces ---
// Filled in empty interfaces
interface IDeveloper {
    enabled: boolean
    date?: string
}
interface ITester {
    enabled: boolean
    date?: string
}
interface IRoles {
    Developer?: IDeveloper
    Tester?: ITester
}
interface ICredentials {
    access_token?: string
    refresh_token?: string
    expires?: string
}

// Base data structure interface (no changes needed here)
export interface IUserBase {
    id: string
    lang?: string
    executedCommands: number
    banned?: boolean
    roles?: IRoles
    credentials?: ICredentials
}

// Mongoose Document Interface - Fixed TS2320
// Now only includes IUserBase and optional Mongoose fields. Doesn't extend Document directly.
export interface User extends IUserBase {
    _id?: Types.ObjectId // Optional _id field from Mongoose
    createdAt?: Date
    updatedAt?: Date
}

// --- Model Export ---
// Model is typed with the User interface. Mongoose handles Document properties internally.
export default model<User>('Users', UserSchema) // Remove trailing comma here if ESLint flagged it
