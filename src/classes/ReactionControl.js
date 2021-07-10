
class ReactionControl {
    constructor({
                message,
                timeout,
                reactions = [],
                filter = ()=> true,
                autodelete = false,
            }) {
        this.reactions = new Map(reactions);
        this.reactionsList = reactions.map(([reaction])=>reaction);
        this.collector = null;
        this.message = message;
        this.timeout = timeout;
        this.autodelete = autodelete;
        this.customFilter = filter;
    }

    filter(reaction, user) {
        if ((this.reactions.has(reaction.emoji.name)) && (this.customFilter(reaction, user))) {
            reaction.user = user;
            return true;
        }
        return false;
    }

    async start() {
        for (let reaction of this.reactionsList) {
            await this.message.react(reaction);
        }
        // КОСТЫЛЬ ПРИДУМАТЬ РЕШЕНИЕ
        await new Promise(res=> setTimeout(res, 300));

        this.collector = this.message.createReactionCollector(() => true);
        this.collector.on('collect', reaction=> {
            this.reactions.get(reaction.emoji.name)(reaction);
            if (this.autodelete) {
                reaction.remove(reaction.user);
            }
        });
        this.collector.on('end', () => {
            this.message.reactions.removeAll()
        });
    }

    stop() {
        this.collector.stop();
    }

    addEReactions() {

    }

    addReaction() {

    }

    removeReactions() {

    }

    removeReaction() {

    }

    updateReaction() {

    }

    updateReactions() {

    }
}

module.exports = ReactionControl;
