const request = require('request');
const fs = require('fs');

module.exports = function(uri, filename){
    return new Promise((resolve, reject)=>{
        request.head(uri, function(err, res, body) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            if ((res.headers['content-type'].split('/')[0] !== 'image') || (+res.headers['content-length'] > 8 * 1024 * 1024 * 8))
                reject(new Error('Wrong HTTP params'));

            request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
        });
    });
};
