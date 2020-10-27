const chalk = require('chalk');
const { printTable } = require('console-table-printer');
require('./configs');
const systemModule = require('./modules/system');
const randomGamesModule = require('./modules/randomGames');
const gifsModule = require('./modules/gifs');
const otherModule = require('./modules/other');
const imagesModule = require('./modules/images');
const userModule = require('./modules/user');
const internalModule = require('./modules/internal');

const Processor = require('./classes/Processor');
const Hook = require('./classes/Hook');

const { NoOrm } = require('@zede/no-orm');

const bot = new Processor();
bot.addModules([
    systemModule,
    randomGamesModule,
    gifsModule,
    otherModule,
    imagesModule,
    userModule,
    internalModule,
]);

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

    const table = [...bot.client.guilds.values()]
        .map(guild => [guild.memberCount, guild.name])
        .sort(([lhs], [rhs])=> lhs - rhs)
        .map(([members, guild]) => ({guild: chalk.greenBright(guild), members: chalk.yellowBright(members)}));
    printTable(table);
    console.log('Activated');
});
