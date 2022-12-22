// import { Schema, model as MongoModel } from 'mongoose';

// const User = new Schema({
//     id: { type: String, required: true },
//     username: { type: String },
//     discriminator: { type: Number },
//     // Interacciones: Interacciones,
// });
// const typeData = new Schema({
//     botNumber: { type: String, required: true },
//     // Interacciones: Interacciones,
// });
// const guild = new Schema({
//     id: { type: String, required: true },
//     name: { type: String },
//     icon: { type: String },
// });

// const model = new Schema(
//     {
//         id: { type: String, required: true },
//         username: { type: String, required: true },
//         botType: { type: Number, required: true },
//         typeData: { type: typeData, required: true },
//         tag: { type: String, required: true },
//         avatar: { type: String, required: true },
//         bio: { type: String, required: false },
//         token: { type: String, required: true },
//         guilds: { type: [guild], required: false },
//         creator: { type: User, required: true },
//     },
//     { collection: 'CustomBot' },
// );

// export default MongoModel('CustomBot', model);
