// const {
//   Client,
//   CommandInteraction,
//   MessageEmbed,
//   Constants: { ApplicationCommandOptionTypes },
// } = require("discord.js");
// const { Modal, TextInputComponent, showModal } = require("discord-modals");
// const Command = require("../../../structures/command.js");
// const report = require("../../../models/report");

// export default class ping extends Command {
//   constructor(client) {
//     super(client, {
//       name: "bugreport",
//       description: "Report a bug.",
//       description_localizations: {
//         "es-ES": "Reporta un bug.",
//       },
//       cooldown: 5,
//       options: [
//         {
//           name: "foto",
//           description: "Send a screenshot of the bug.",
//           description_localizations: {
//             "es-ES": "Envía una captura de pantalla del bug.",
//           },
//           type: 11,
//         },
//       ],
//     });
//   }
//   async run(client, interaction, args) {
//     const modal = new Modal()
//       .setCustomId("bug-report")
//       .setTitle("Bug report")
//       .addComponents(
//         new TextInputComponent()
//           .setCustomId("bug-description")
//           .setLabel("Descripción del bug")
//           .setStyle("LONG")
//           .setMinLength(5)
//           .setMaxLength(3700)
//           .setPlaceholder("Escribe una descripción del bug.")
//           .setRequired(true),
//         new TextInputComponent()
//           .setCustomId("bug-happen")
//           .setLabel("Que es lo que sucede")
//           .setStyle("LONG")
//           .setMinLength(5)
//           .setMaxLength(3700)
//           .setPlaceholder("Escribe lo que sucede.")
//           .setRequired(true),
//         new TextInputComponent()
//           .setCustomId("bug-expected")
//           .setLabel("Que deberia suceder")
//           .setStyle("LONG")
//           .setMinLength(5)
//           .setMaxLength(3700)
//           .setPlaceholder("Escribe lo que deberia suceder.")
//           .setRequired(true)
//       );

//     showModal(modal, {
//       client: client,
//       interaction: interaction,
//     });
//   }
// };
