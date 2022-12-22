const Logger = require('../utils/console');
const simplestDiscordWebhook = require('simplest-discord-webhook');
require('dotenv').config();
const { MessageEmbed } = require('discord.js');
const Sentry = require('@sentry/node');
const webhookClient = new simplestDiscordWebhook(process.env.errorWebhookURL);
module.exports = client => {
    process.on('unhandledRejection', async (reason, p) => {
        const errorEmbed = new MessageEmbed()
            .setColor(15548997)
            .addField('Razón', '```' + (await reason) + '```')
            .addField('Error', '```' + (await p) + '```');
        await webhookClient.send(errorEmbed);
        Sentry.captureException(p);
        Logger.warn(' [antiCrash] :: Unhandled Rejection/Catch');
        Logger.error(reason, p);
    });
    process.on('uncaughtException', (err, origin) => {
        const errorEmbed = new MessageEmbed()
            .setColor(15548997)
            .addField('Origen', '```' + origin + '```')
            .addField('Error', '```' + err + '```');
        webhookClient.send(errorEmbed);
        Logger.warn(' [antiCrash] :: Uncaught Exception/Catch');
        Logger.error(err, origin);
    });
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        const errorEmbed = new MessageEmbed()
            .setColor(15548997)
            .addField('Origen', '```' + origin + '```')
            .addField('Error', '```' + err + '```');
        webhookClient.send(errorEmbed);
        Logger.warn(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        Logger.error(err, origin);
    });
    process.on('multipleResolves', (type, promise, reason) => {
        const errorEmbed = new MessageEmbed().setColor(15548997).addField('Razón', '```' + reason + '```');
        webhookClient.send(errorEmbed);
        Logger.warn(' [antiCrash] :: Multiple Resolves');
        Logger.error(reason);
    });
};
