const gm = require('gm').subClass({imageMagick: true});

gm.prototype.$ = function(string) {
    return this.out(...string.split(' '));
};

gm.prototype.push = function(string) {
    return this.out(string);
};

gm.prototype.lb = function() {
    return this.out("(");
};

gm.prototype.rb = function() {
    return this.out(")");
};

gm.prototype.clone = function() {
    return this.out("+clone");
};

gm.prototype.sepiaTone = function(string = '50%') {
    if ((typeof string !== 'string') || (string[string.length - 1] !== '%'))
        string = `${string}%`;
    return this.out("-sepia-tone", string);
};

module.exports = gm;