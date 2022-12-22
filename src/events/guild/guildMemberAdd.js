const Event = require("../../structures/event");
const Canvas = require("canvas");
const Discord = require("discord.js");
module.exports = class guildMemberAdd extends Event {
  constructor(...args) {
    super(...args);
  }
  async run(member) {
    // if (!member.guild.id !== "834440041010561074") return;
    if (!member.guild.id) return;
    const canvas = Canvas.createCanvas(1772, 633);
    const ctx = canvas.getContext("2d");
    const background = await Canvas.loadImage(`./files/welcome.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#f2f2f2";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    var textString3 = `${member.user.username}`;
    if (textString3.length >= 14) {
      ctx.font = "bold 100px Genta";
      ctx.fillStyle = "#f2f2f2";
      ctx.fillText(textString3, 720, canvas.height / 2 + 20);
    } else {
      ctx.font = "bold 150px Genta";
      ctx.fillStyle = "#f2f2f2";
      ctx.fillText(textString3, 720, canvas.height / 2 + 20);
    }
    var textString2 = `#${member.user.discriminator}`;
    ctx.font = "bold 40px Genta";
    ctx.fillStyle = "#f2f2f2";
    ctx.fillText(textString2, 730, canvas.height / 2 + 58);
    //define the Member count
    var textString4 = `Member #${member.guild.memberCount}`;
    ctx.font = "bold 60px Genta";
    ctx.fillStyle = "#f2f2f2";
    ctx.fillText(textString4, 750, canvas.height / 2 + 125);
    //get the Guild Name
    var textString4 = `${member.guild.name}`;
    ctx.font = "bold 60px Genta";
    ctx.fillStyle = "#f2f2f2";
    ctx.fillText(textString4, 700, canvas.height / 2 - 150);
    ctx.beginPath();
    ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true); //position of img
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({
        format: "jpg",
      })
    );
    ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "welcome-image.png"
    );
    const channel = member.guild.channels.cache.get("964522476396748831");
    channel.send({ files: [attachment], content: "Welcome to the server!" });
    // let roles = config.ROLES_WELCOME;
    // for(let i = 0; i < roles.length; i++ )
    // member.roles.add(roles[i]);
  }
};
