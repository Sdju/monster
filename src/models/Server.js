const { NoOrm, Model, Types } = require('@zede/no-orm');

class Server extends Model {
    constructor(id, serverId) {
        super(id);
        this._serverId = serverId;
    }

    async toDefault() {
        await super.toDefault();
        this.serverId = this._serverId;
    }
}
NoOrm.newModel(Server, 'servers', {
    serverId: Types.Elementary(''),
    prefix: Types.Elementary('-'),
    lang: Types.Elementary('ru'),
});

module.exports = Server;