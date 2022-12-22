import { CommandInteraction, VoiceChannel } from 'discord.js';

export default interface message {
    // [key: string]: boolean;
    reply: any;
    content: {
        system: 'music';
        command: 'play' | 'error' | 'createPlayer';
        data: {
            interaction: CommandInteraction;
            args: string[];
            bot?: 1 | 2 | 3 | 4 | 'custom';
            shardId?: number;
            voiceChannel?: VoiceChannel;
        };
    };
}
