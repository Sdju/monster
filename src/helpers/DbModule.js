const { NoOrm, Model, Types } = require('@zede/no-orm');

const Module = require('../classes/Module');
const ServerModel = require('../models/Server');
const UserModel = require('../models/User');

const serversCache = new Map();
const usersCache = new Map();

class DbModule extends Module {
    messageHook(message) {
        this.hookProcessor.emit('message', message).then(async ()=> {
            const serverModel = await this.getServer(message.guild.id);
            message.serverModel = serverModel;
            message.userModel = await this.getUser(message.author.id);
            await this.beforeCommand(message);
            if (message.content.startsWith(serverModel.prefix)) {
                const curCmdName = message.content.slice(serverModel.prefix.length).split(' ')[0].toLowerCase();
                if (curCmdName in this.commandMap) {
                    message.text = message.content.slice(serverModel.prefix.length + curCmdName.length).trim();
                    return this.commandMap[curCmdName].exec(message);
                }
            }
            await this.afterCommand(message);
        })
    }

    beforeCommand() {
    }

    afterCommand() {

    }

    async getServer(id) {
        if (!serversCache.has(id)) {
            const serverModel = await NoOrm.find(ServerModel, {serverId: id}, {
                orCreate: true,
                createParams: [id],
            });
            serversCache.set(id, serverModel)
        }
        return serversCache.get(id);
    }

    async getUser(id) {
        if (!usersCache.has(id)) {
            const userModel = await NoOrm.find(UserModel, {userId: id}, {
                orCreate: true,
                createParams: [id],
            });
            usersCache.set(id, userModel)
        }
        return usersCache.get(id);
    }
}

module.exports = DbModule;