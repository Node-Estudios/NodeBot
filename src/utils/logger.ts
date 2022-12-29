import signale from 'signale'
const {Signale} = signale
// TODO? use global client?
export default new Signale({
    // TODO: use cluster id
    scope: `Cluster $ID`,
    config: {
        displayTimestamp: true,
        displayDate: true,
    },
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
        },
    },
})
