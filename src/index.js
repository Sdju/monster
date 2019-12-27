require('./configs');
const systemModule = require('./modules/system');
const randomGamesModule = require('./modules/randomGames');
const gifsModule = require('./modules/gifs');
const otherModule = require('./modules/other');
const imagesModule = require('./modules/images');
const userModule = require('./modules/user');

const Processor = require('./classes/Processor');
const Hook = require('./classes/Hook');

const { NoOrm } = require('@zede/no-orm');

const bot = new Processor();
bot.addModule(systemModule);
bot.addModule(randomGamesModule);
bot.addModule(gifsModule);
bot.addModule(otherModule);
bot.addModule(imagesModule);
bot.addModule(userModule);

bot.hookProcessor.activateHook(new Hook('message', message => {
    if (message.content.toLowerCase() === 'w') {
        if (message.author.id !== bot.client.user.id)
            message.channel.send('w');
    } else if (message.content === '^') {
        message.channel.send('I agree!')
    }
}));

bot.activate().then(async ()=> {
    const dbConfigs = {
        dbName: process.env.DB_NAME,
        name: process.env.DB_USERNAME,
        pwd: process.env.DB_PWD,
        ip: process.env.DB_IP,
        port: process.env.DB_PORT,
        authSource: process.env.DB_AUTHSOURCE,
    };
    await NoOrm.connect(dbConfigs);

    for (const guild of bot.client.guilds.values()) {
        console.log(guild.name);
    }
    console.log('Activated');
});
