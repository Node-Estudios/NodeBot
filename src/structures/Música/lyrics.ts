// const {
//   Client,
//   CommandInteraction,
//   MessageEmbed,
//   Discord,
// } = require("discord.js");
// const axios = require("axios");
// const Command = require("../../../structures/command.js");
// module.exports = class lyrics extends Command {
//   constructor(client) {
//     super(client, {
//       name: "lyrics",
//       description: "Search for a song lyrics or the current song lyrics.",
//       name_localizations: {
//         "es-ES": "letras",
//       },
//       description_localizations: {
//         "es-ES": "Busca por la letra de una canción específica o la actual",
//       },
//       cooldown: 5,
//       options: [
//         {
//           type: 3,
//           name: "song",
//           description: "Song to search the lyrics.",
//           name_localizations: {
//             "es-ES": "canción",
//           },
//           description_localizations: {
//             "es-ES": "Canción para buscar la letra.",
//           },
//           required: true,
//         },
//       ],
//     });
//   }
//   /**,
//    * @param {Client} client
//    * @param {CommandInteraction} interaction
//    * @param {String[]} args
//    */
//   async run(client, interaction, args) {
//     let titulo = args.join("%20");
//     axios
//       .get(`https://some-random-api.ml/lyrics?title=${titulo}`)
//       .then((res) => {
//         const embed = new MessageEmbed()
//           .setTitle(res.data.title)
//           .setURL(res.data.links.genius)
//           .setColor(process.env.bot1Embed_Color)
//           .setDescription(res.data.lyrics)
//           .setFooter(res.data.author)
//           .setThumbnail(res.data.thumbnail.genius);
//         return interaction.editReply({ embeds: [embed] });
//       });
//   }
// };
