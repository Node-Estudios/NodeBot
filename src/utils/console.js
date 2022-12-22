"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// tslint:disable-next-line:no-var-requires
var Signale = require('signale').Signale;
var fs = require('fs');
var Logger = /** @class */ (function (_super) {
    __extends(Logger, _super);
    function Logger(config, client) {
        return _super.call(this, {
            config: config,
            // stream: [process.stderr, fs.createWriteStream('./log.txt')],
            logLevel: 'info',
            types: {
                startUp: {
                    badge: '✔',
                    color: 'green',
                    label: 'Inicio',
                    logLevel: 'info'
                },
                log: {
                    badge: '👍',
                    color: 'white',
                    label: 'Info',
                    logLevel: 'info'
                },
                db: {
                    badge: '🥭',
                    color: 'greenBright',
                    label: 'Base de datos',
                    logLevel: 'info'
                },
                music: {
                    badge: '🎶',
                    color: 'magentaBright',
                    label: 'Música',
                    logLevel: 'info'
                },
                error: {
                    badge: '❌',
                    color: 'red',
                    label: 'Error',
                    logLevel: 'error'
                },
                down: {
                    badge: '⚫',
                    color: 'grey',
                    label: 'Apagado',
                    logLevel: 'info'
                },
                command: {
                    badge: '⌨️',
                    color: 'bgGreenBright',
                    label: 'Comando',
                    logLevel: 'info'
                },
                api: {
                    badge: '🛰️',
                    color: 'blue',
                    label: 'API',
                    logLevel: 'info'
                },
                warn: {
                    badge: '⚠️',
                    color: 'yellow',
                    label: 'warn',
                    logLevel: 'warn'
                }
            },
            scope: client ? "Cluster ".concat(parseInt(client.cluster.id)) : 'Manager'
        }) || this;
    }
    return Logger;
}(Signale));
exports["default"] = Logger;
