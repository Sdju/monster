const urlEx = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const emojiEx = /<:([a-zA-Z_\-0-9]+):(\d+)>/;
const emojiGifEx = /<a:([a-zA-Z_\-0-9]+):(\d+)>/;

module.exports = function(message) {
    if ((message.attachments.size > 0) && (message.attachments.first().height > 0)) {
        const img = message.attachments.first();
        return {
            url: img.url,
            name: img.filename
        }
    } else if (urlEx.exec(message.content)) {
        const res = urlEx.exec(message.content)[0];
        const arr = res.split('/');
        return {
            url: res,
            name: arr[arr.length - 1].split('?')[0]
        }
    } else if (message.mentions.users.size > 0) {
        const res = message.mentions.users.first().avatarURL;
        const arr = res.split('/');
        return {
            url: res,
            name: arr[arr.length - 1].split('?')[0]
        };
    } else if (emojiEx.exec(message.content)) {
        const res = emojiEx.exec(message.content);
        return {
            url: `https://cdn.discordapp.com/emojis/${res[2]}.png`,
            name: `${res[1]}.png`
        }
    } else if (emojiGifEx.exec(message.content)) {
        const res = emojiGifEx.exec(message.content);
        return {
            url: `https://cdn.discordapp.com/emojis/${res[2]}.gif`,
            name: `${res[1]}.gif`
        }
    }
    return null
};
