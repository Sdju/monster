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
}
NoOrm.newModel(User, 'users', {
    userId: Types.Elementary(''),
    exp: Types.Elementary(0),
});

module.exports = User;