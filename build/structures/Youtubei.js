import { Collection } from 'discord.js';
import EmbedBuilder from '#structures/EmbedBuilder.js';
import { SpamIntervalDB } from './spamInterval.js';
import { Innertube } from 'youtubei.js';
import UserModel from '#models/user.js';
import logger from '#utils/logger.js';
const spamInterval = new SpamIntervalDB();
export default class Youtubei {
    youtubeCodes = new Collection();
    spamInterval = spamInterval;
    user;
    music;
    session;
    constructor(user) {
        this.user = user;
    }
    async createSession() {
        const innertube = await Innertube.create({});
        this.music = innertube.music;
        this.session = innertube.session;
        await this.start();
        return this;
    }
    get() {
        return this;
    }
    async start() {
        this.startListeners();
    }
    async sendSpamMSG(user, msg) { }
    async checkUserSpamInterval(user) {
        if (!this.spamInterval.checkUser(user.id)) {
            const embed = new EmbedBuilder().setDescription('Has iniciado sesión correctamente. Node ya tiene acceso para ver tus canciones favoritas! Si deseas revocar este acceso, puedes hacerlo desde [este link de google](https://myaccount.google.com/permissions)');
            this.spamInterval.addUser(user.id, 7 * 24 * 60 * 60 * 1000);
            return await user.send({ embeds: [embed] }).catch(e => {
                logger.error(e);
            });
        }
    }
    async startListeners() {
        logger.debug('Starting listeners YTi');
        const user = this.user;
        this.session.on('auth-pending', (data) => {
            logger.debug('auth pending');
            if (!this.spamInterval.checkUser(user.id)) {
                this.youtubeCodes.set(data.user_code, user);
                const embed = new EmbedBuilder()
                    .setDescription('It seems like you dont sign in using Youtube, would you like to?')
                    .addFields([
                    {
                        name: `Sign in with youtube in the next link; Use code: ${data.user_code}`,
                        value: data.verification_url,
                    },
                ]);
                this.spamInterval.addUser(user.id, 30 * 60 * 1000);
                user.send({ embeds: [embed] }).catch(e => {
                    logger.error(e);
                });
            }
        });
        this.session.on('update-credentials', ({ credentials }) => {
            UserModel.findOne({ id: user.id }).then(async (user2) => {
                if (user2) {
                    user2.credentials = credentials;
                    return user2.save();
                }
                else {
                    return UserModel.create({
                        id: user.id,
                        executedCommands: 0,
                        roles: { Developer: { enabled: false }, Tester: { enabled: false }, credentials },
                    });
                }
            });
        });
        this.session.on('auth', async ({ credentials }) => {
            logger.debug('iniciado sesión correctamente');
            UserModel.findOne({ id: user.id }).then(async (user2) => {
                credentials.expires_at = Date.now() + credentials.expires_in * 1000;
                if (user2) {
                    user2.credentials = credentials;
                    return user2.save();
                }
                else {
                    return UserModel.create({
                        id: user.id,
                        executedCommands: 0,
                        roles: { Developer: { enabled: false }, Tester: { enabled: false }, credentials },
                    });
                }
            });
            if (!this.spamInterval.checkUser(user.id)) {
                const embed = new EmbedBuilder().setDescription('Has iniciado sesión correctamente. Node ya tiene acceso para ver tus canciones favoritas! Si deseas revocar este acceso, puedes hacerlo desde [este link de google](https://myaccount.google.com/permissions)');
                this.spamInterval.addUser(user.id, 7 * 24 * 60 * 60 * 1000);
                return await user.send({ embeds: [embed] }).catch(e => {
                    logger.error(e);
                });
            }
        });
    }
}
//# sourceMappingURL=Youtubei.js.map