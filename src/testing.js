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
var _this = this;
var Discord = require('discord.js');
var client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
var _a = require('yasha'), Source = _a.Source, TrackPlayer = _a.TrackPlayer, VoiceConnection = _a.VoiceConnection;
client.on('ready', function () {
    console.log('Ready!');
});
client.on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
    var connection, player, track, connection, player, track;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(message.content == 'p')) return [3 /*break*/, 4];
                return [4 /*yield*/, VoiceConnection.connect(message.member.voice.channel)];
            case 1:
                connection = _a.sent();
                player = new TrackPlayer({ normalize_volume: false, external_encrypt: true, external_packet_send: true });
                return [4 /*yield*/, Source.resolve('https://music.youtube.com/watch?v=0oAAlssVwEw')];
            case 2:
                track = _a.sent();
                connection.subscribe(player);
                player.play(track);
                player.on('packet', function (buffer, frame_size) {
                    console.log("Packet: ".concat(frame_size, " samples"));
                });
                player.on('ready', function () {
                    console.log("Ready");
                });
                player.setVolume(1);
                player.setBitrate(360000);
                console.log(player, player.isCodecCopy());
                player.start();
                return [4 /*yield*/, message.channel.send('Now playing: **' + track.title.replaceAll('**', '\\*\\*') + '**')];
            case 3:
                _a.sent();
                return [3 /*break*/, 8];
            case 4:
                if (!(message.content == 'p2')) return [3 /*break*/, 8];
                return [4 /*yield*/, VoiceConnection.connect(message.member.voice.channel)];
            case 5:
                connection = _a.sent();
                player = new TrackPlayer();
                return [4 /*yield*/, Source.resolve('https://music.youtube.com/watch?v=0oAAlssVwEw')];
            case 6:
                track = _a.sent();
                connection.subscribe(player);
                player.play(track);
                player.on('packet', function (buffer, frame_size) {
                    console.log("Packet: ".concat(frame_size, " samples"));
                });
                player.setVolume(1);
                console.log(player, player.isCodecCopy());
                player.start();
                return [4 /*yield*/, message.channel.send('Now playing: **' + track.title.replaceAll('**', '\\*\\*') + '**')];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
client.login('ODM0MTY0NjAyNjk0MTM5OTg1.GyOq2Q.w98AqlsQkpvwFlbLwJXtUox_jT_-5-aM9A_bFQ');
