const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

const { Source, TrackPlayer, VoiceConnection } = require('yasha');

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', async (message: any) => {
    if (message.content == 'p') {
        var connection = await VoiceConnection.connect(message.member.voice.channel); // see docs/VoiceConnection.md
        var player = new TrackPlayer({ normalize_volume: false, external_encrypt: true, external_packet_send: true }); // see docs/TrackPlayer.md

        var track = await Source.resolve('https://music.youtube.com/watch?v=0oAAlssVwEw'); // see docs/Source.md

        connection.subscribe(player);
        player.play(track);
        player.on('packet', (buffer: Buffer, frame_size: number) => {
            console.log(`Packet: ${frame_size} samples`);
        });
        player.on('ready', () => {
            console.log("Ready")
        })
        player.setVolume(1);
        player.setBitrate(360000)
        console.log(player, player.isCodecCopy())
        player.start();

        await message.channel.send('Now playing: **' + track.title.replaceAll('**', '\\*\\*') + '**');
    } else if (message.content == 'p2') {
        var connection = await VoiceConnection.connect(message.member.voice.channel); // see docs/VoiceConnection.md
        var player = new TrackPlayer(); // see docs/TrackPlayer.md

        var track = await Source.resolve('https://music.youtube.com/watch?v=0oAAlssVwEw'); // see docs/Source.md

        connection.subscribe(player);
        player.play(track);
        player.on('packet', (buffer: Buffer, frame_size: number) => {
            console.log(`Packet: ${frame_size} samples`);
        });
        player.setVolume(1);
        console.log(player, player.isCodecCopy())
        player.start();

        await message.channel.send('Now playing: **' + track.title.replaceAll('**', '\\*\\*') + '**');
    }
});

client.login('ODM0MTY0NjAyNjk0MTM5OTg1.GyOq2Q.w98AqlsQkpvwFlbLwJXtUox_jT_-5-aM9A_bFQ');