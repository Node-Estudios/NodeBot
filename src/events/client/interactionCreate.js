"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// const UserModel = require('../../models/user');
var MessageEmbed = require('discord.js').MessageEmbed;
var Discord = require('discord.js');
var getRandomPhrase = require('../../utils/getRandomPhrase');
var Statcord = require('statcord.js');
var cooldowns = new Discord.Collection();
var interactionCreate = /** @class */ (function () {
    function interactionCreate() {
    }
    interactionCreate.prototype.run = function (interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var commandName, desc, loadingEmbed, cmd, args_1, _i, _b, option, permissionHelpMessage, missingPermissions, user, missingPermissions, now, timestamps_1, cooldownAmount, expirationTime, timeLeft, menu, button;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!client.user)
                            return [2 /*return*/];
                        if (!interaction.guild)
                            return [2 /*return*/];
                        if (!interaction.isCommand()) return [3 /*break*/, 11];
                        commandName = interaction.commandName;
                        desc = client.language.NODETHINKING[Math.floor(Math.random() * (Object.keys(client.language.NODETHINKING).length + 1) + 1)];
                        if (!desc)
                            desc = client.language.NODETHINKING[1];
                        loadingEmbed = new MessageEmbed().setColor(process.env.bot1Embed_Color).setDescription(desc);
                        return [4 /*yield*/, interaction
                                .reply({
                                embeds: [loadingEmbed]
                            })["catch"](function (e) {
                                client.logger.error(e);
                            })];
                    case 1:
                        _c.sent();
                        cmd = client.commands.find(function (cmd2) { return cmd2.name === interaction.commandName; });
                        if (!cmd) return [3 /*break*/, 9];
                        client.logger.info("Comando ".concat(cmd.name, " ejecutado"));
                        args_1 = [];
                        for (_i = 0, _b = interaction.options.data; _i < _b.length; _i++) {
                            option = _b[_i];
                            if (option.type === 'SUB_COMMAND') {
                                if (option.name)
                                    args_1.push(option.name);
                                (_a = option.options) === null || _a === void 0 ? void 0 : _a.forEach(function (x) {
                                    if (x.value)
                                        args_1.push(x.value);
                                });
                            }
                            else if (option.value)
                                args_1.push(option.value);
                        }
                        permissionHelpMessage = "Hey! Tienes problemas? Entra en nuestro servidor.";
                        if (!cmd.permissions) return [3 /*break*/, 8];
                        cmd.permissions.botPermissions.concat(['SEND_MESSAGES', 'EMBED_LINKS']);
                        if (!(cmd.permissions.botPermissions.length > 0)) return [3 /*break*/, 7];
                        missingPermissions = cmd.permissions.botPermissions.filter(function (perm) { return !interaction.guild.me.permissions.has(perm); });
                        if (!(missingPermissions.length > 0)) return [3 /*break*/, 7];
                        if (!missingPermissions.includes('SEND_MESSAGES')) return [3 /*break*/, 6];
                        user = client.users.cache.get('id');
                        if (!!user) return [3 /*break*/, 2];
                        return [2 /*return*/];
                    case 2:
                        if (!!user.dmChannel) return [3 /*break*/, 4];
                        return [4 /*yield*/, user.createDM()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [4 /*yield*/, user.dmChannel.send("No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **".concat(missingPermissions.join(', '), "**\n").concat(permissionHelpMessage))];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/, interaction.editReply({
                            content: "No tengo los permisos necesarios para ejecutar este comando, Permisos necesarios: **".concat(missingPermissions.join(', '), "**\n").concat(permissionHelpMessage),
                            embeds: []
                        })];
                    case 7:
                        if (cmd.permissions.userPermissions.length > 0) {
                            missingPermissions = cmd.permissions.userPermissions.filter(function (perm) { return !interaction.member.permissions.has(perm); });
                            if (missingPermissions.length > 0) {
                                return [2 /*return*/, interaction.editReply({
                                        content: "No tienes los permisos necesarios para ejecutar este comando, Permisos necesarios: **".concat(missingPermissions.join(', '), "**"),
                                        embeds: []
                                    })];
                            }
                        }
                        if (cmd.permissions.botPermissions.includes(Discord.Permissions.CONNECT) &&
                            !interaction.member
                                .voice.channel.permissionsFor(client.user)
                                .has(Discord.Permissions.CONNECT))
                            return [2 /*return*/, interaction.editReply({
                                    content: 'No tengo permisos de conectarme al canal de voz donde estás',
                                    embeds: []
                                })];
                        if (cmd.permissions.botPermissions.includes(Discord.Permissions.SPEAK) &&
                            !interaction.member
                                .voice.channel.permissionsFor(client.user)
                                .has(Discord.Permissions.SPEAK))
                            return [2 /*return*/, interaction.editReply({
                                    content: 'No tengo permisos de hablar en el canal de voz donde estás',
                                    embeds: []
                                })];
                        //CHECK PERMISSION
                        if (cmd.permissions.dev === true && !client.devs.includes(interaction.user.id))
                            return [2 /*return*/, interaction.editReply({
                                    content: 'Comando exclusivo para devs',
                                    embeds: []
                                })];
                        _c.label = 8;
                    case 8:
                        //COOLDOWN, TAMBIÉN COPIADO DE OTRO BOT EKISDEEEEE
                        if (!client.devs.includes(interaction.user.id)) {
                            if (!cooldowns.has(commandName)) {
                                cooldowns.set(commandName, new Discord.Collection());
                            }
                            now = Date.now();
                            timestamps_1 = cooldowns.get(commandName);
                            cooldownAmount = Math.floor(cmd.cooldown || 5) * 1000;
                            if (!timestamps_1.has(interaction.user.id)) {
                                timestamps_1.set(interaction.user.id, now);
                                setTimeout(function () { return timestamps_1["delete"](interaction.user.id); }, cooldownAmount);
                            }
                            else {
                                expirationTime = timestamps_1.get(interaction.user.id) + cooldownAmount;
                                timeLeft = (expirationTime - now) / 1000;
                                if (now < expirationTime && timeLeft > 0.9) {
                                    return [2 /*return*/, interaction.editReply({
                                            content: "Heyy! Ejecutas los coamndos demasiado r\u00E1pido! Espera ".concat(timeLeft.toFixed(1), " segundos para ejecutar `").concat(commandName, "`"),
                                            embeds: []
                                        })];
                                }
                                timestamps_1.set(interaction.user.id, now);
                                setTimeout(function () { return timestamps_1["delete"](interaction.user.id); }, cooldownAmount);
                            }
                        }
                        //COOLDOWN
                        cmd.run(client, interaction, args_1);
                        if (process.env.NODE_ENV == 'production')
                            Statcord.ShardingClient.postCommand(cmd.name, interaction.member.id, client);
                        return [3 /*break*/, 10];
                    case 9:
                        if (!cmd)
                            return [2 /*return*/, interaction.editReply({
                                    content: 'No se encontró el comando',
                                    embeds: [],
                                    components: [],
                                    files: []
                                })];
                        interaction.editReply({
                            content: cmd.response
                        });
                        _c.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (interaction.isSelectMenu()) {
                            menu = client.selectMenu.get(interaction.customId);
                            if (menu)
                                menu.run(client, interaction);
                        }
                        else if (interaction.isButton()) {
                            button = client.buttons.get(interaction.customId);
                            if (button)
                                button.run(client, interaction);
                        }
                        _c.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    return interactionCreate;
}());
exports["default"] = interactionCreate;
