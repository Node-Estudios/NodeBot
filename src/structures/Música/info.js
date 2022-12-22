const {
  Client,
  CommandInteraction,
  MessageEmbed,
  Discord,
} = require("discord.js");
const Command = require("../../../structures/command.js");
module.exports = class info extends Command {
  constructor(client) {
    super(client, {
      name: "info",
      description: "Information about the multibot system.",
      name_localizations: {
        "es-ES": "info",
      },
      description_localizations: {
        "es-ES": "Información sobre el sistema multibot.",
      },
      cooldown: 5,
    });
  }
  /**,
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  async run(client, interaction, args) {
    const embed = new MessageEmbed()
      .setColor(process.env.bot1Embed_Color)
      .setDescription(
        `**¡Hola! ¿Buscabas una explicación verdad? Has llegado al sitio correcto <a:dankiespepe:967933614471909417>**`
      )
      .addField(
        "¿En qué consiste? <:monkaThink:969921099867508796>",
        `Node dispone de un sistema de 4 bots, los cuales son gestionados desde una sola instancia. De esta manera, nosotros nos encargamos de gestionar vuestras solicitudes de escuchar música y que tengais un bot disponible.`
      )
      .addField(
        '¿Por qué los 4 bots no tienen comandos? <a:PepeLookingYou:969921144125816872>',
        'Porque los bots son gestionados desde uno de ellos (normalmente Node Principal). Por lo tanto, no es necesario que cada bot tenga un comando para escuchar música.')
      .addField(
        '¿Que ventajas me aporta? <:peepoBusinessTux:969921198181990440>',
        `Gracias a este sistema, siempre usarás el mismo comando y nosotros elegiremos el bot que esté disponible. De esta manera evitamos que tengas que fijarte en qué bot está disponible para saber qué comando ejecutar.`
      )
      .setThumbnail(interaction.member.displayAvatarURL({
        dynamic: true
      }))
    await interaction.editReply({
      embeds: [embed],
      components: []
    })
  }
};