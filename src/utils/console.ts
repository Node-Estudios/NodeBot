// tslint:disable-next-line:no-var-requires
const { Signale } = require('signale');
const fs = require('fs');

export default class Logger extends Signale {
    constructor(config: any, client?: any) {
        super({
            config,
            // stream: [process.stderr, fs.createWriteStream('./log.txt')],
            logLevel: 'info',
            types: {
                startUp: {
                    badge: '✔',
                    color: 'green',
                    label: 'Inicio',
                    logLevel: 'info',
                },
                log: {
                    badge: '👍',
                    color: 'white',
                    label: 'Info',
                    logLevel: 'info',
                },
                db: {
                    badge: '🥭',
                    color: 'greenBright',
                    label: 'Base de datos',
                    logLevel: 'info',
                },
                music: {
                    badge: '🎶',
                    color: 'magentaBright',
                    label: 'Música',
                    logLevel: 'info',
                },
                error: {
                    badge: '❌',
                    color: 'red',
                    label: 'Error',
                    logLevel: 'error',
                },
                down: {
                    badge: '⚫',
                    color: 'grey',
                    label: 'Apagado',
                    logLevel: 'info',
                },
                command: {
                    badge: '⌨️',
                    color: 'bgGreenBright',
                    label: 'Comando',
                    logLevel: 'info',
                },
                api: {
                    badge: '🛰️',
                    color: 'blue',
                    label: 'API',
                    logLevel: 'info',
                },
                warn: {
                    badge: '⚠️',
                    color: 'yellow',
                    label: 'warn',
                    logLevel: 'warn',
                }
            },
            scope: client ? `Cluster ${parseInt(client.cluster.id)}` : 'Manager',
        });
    }
}
