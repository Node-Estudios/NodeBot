import cors from 'cors';
import express from 'express';
import NodeManager from '../structures/NodeManager.js';
import logger from '../utils/logger.js';
import ApiModule from './api/app.js';

export default class restApiBase {
    manager: NodeManager
    app: express.Application
    constructor(manager: NodeManager) {
        this.manager = manager;
        this.app = express()
    }
    async loadModules() {
        // this.app.use(express.static(__dirname + "/public"));
        this.app.use(
            cors({
                origin: ["http://localhost:3000", "http://localhost:5000", "http://176.9.111.217:3000", "https://176.9.111.217:3000"],
                credentials: true,
            })
        );
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        this.app.use("/api", await new ApiModule(this.manager).load());
        this.app.get("/dashboard", function (req, res) {
            res.redirect(`${process.env.URL}:3000/`);
        });
    }
    async start() {
        await this.loadModules()
        this.app.listen(3000, () => {
            logger.startUp('Server listening on port 3000')
        })
        return true
    }
};