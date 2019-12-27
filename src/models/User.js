const { NoOrm, Model, Types } = require('@zede/no-orm');

class User extends Model {
    constructor(id, userId) {
        super(id);
        this._userId = userId;
    }

    async toDefault() {
        await super.toDefault();
        this.userId = this._userId;
    }

    async addExp() {
        this.exp += 1;
        await this.save();
    }

    async goldDaily() {
        this.gold += 200;
        await this.save();
        
    }

    static async refresh() {
        NoOrm.remove(User);
    }
    
}
NoOrm.newModel(User, 'users', {
    userId: Types.Elementary(''),
    exp: Types.Elementary(0),
    gold: Types.Elementary(0),
    switch: Types.Elementary(0),
});

module.exports = User;