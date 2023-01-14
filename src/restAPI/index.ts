import INestApplication from '@nestjs/common/interfaces/nest-application.interface.js';
import { NestFactory } from '@nestjs/core';
import NodeManager from '../structures/NodeManager.js';
import logger from '../utils/logger.js';
import AppModule from './app.js';

export class restApiBase {
    manager: NodeManager
    app: Promise<INestApplication.INestApplication>;
    constructor(manager: NodeManager) {
        this.manager = manager;
        this.app = NestFactory.create(AppModule);
    }
    async start() {
        return (await this.app).listen(3000, () => {
            logger.log('Server listening on port 3000')
            return true
        })
    }
};