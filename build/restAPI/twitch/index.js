import express, { Router as router } from 'express';
import TwitchModel from '#models/twitch.js';
import { REST, Routes } from 'discord.js';
import Translator, { keys } from '#utils/Translator.js';
const rest = new REST().setToken(process.env.TOKEN);
export default class Twitch {
    manager;
    router = router();
    constructor(manager) {
        this.manager = manager;
        this.#load();
    }
    #load() {
        this.router.use(express.json());
        this.router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
            const type = req.headers.webhook_callback_verification ?? '';
            if (type === 'webhook_callback_verification') {
                const body = req.body;
                return res.status(200).send(body.challenge);
            }
            if (type === 'revocation') {
                return res.status(200).send('ok');
            }
            if (type !== 'notification') {
                return res.status(200).send('ok');
            }
            res.status(200).send('ok');
            const body = req.body;
            const subs = await TwitchModel.find({
                streamerId: body.event.broadcaster_user_id,
            });
            for (const sub of subs) {
                const translate = Translator(await this.getGuildLang(sub.guildId));
                await rest.post(Routes.channelMessages(sub.channelId), {
                    body: {
                        content: `${sub.roleId ? `<@&${sub.roleId}> ` : ''}${translate(keys.twitch.now_live, {
                            streamer: body.event.broadcaster_user_name,
                        })}`,
                    },
                });
            }
            return undefined;
        });
        return this.router;
    }
    async getGuildLang(guildId) {
        const guild = await rest.get(Routes.guild(guildId));
        return guild?.preferred_locale ?? 'en-US';
    }
}
//# sourceMappingURL=index.js.map