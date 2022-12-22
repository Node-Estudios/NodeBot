const mongoose = require("mongoose");

const User = new mongoose.Schema({
    id: { type: String, required: true },
    message: { type: String, required: true },
});
const Embed = new mongoose.Schema({
  color: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  footer: { type: String },
  timestamp: { type: String },
  titleURL: { type: String },
  thumbnail: { type: String },
  footericon: { type: String },
});

const Link = new mongoose.Schema({
  message: { type: String, required: true },
});

const CustomMessageTypeGuild = new mongoose.Schema({
  embed: { type: Embed },
  link: { type: Link },
})
const Guild = new mongoose.Schema({
    id: { type: String, required: true },
    textChannel: { type: String, required: true },
    customMessage: { type: CustomMessageTypeGuild, required: true },
});
const Interacciones = new mongoose.Schema({
    Guilds: { type: [Guild]},
    Users: { type: [User]},
});

const model = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    display_name: { type: String, required: true },
    broadcaster_user_id: { type: String, required: true },
    created_at: { type: String },
    cost: { type: Number },
    login: { type: String, required: true },
    Interacciones: { type: Interacciones, required: true },
  },
  { collection: "Twitch" }
);

module.exports = mongoose.model("Twitch", model);