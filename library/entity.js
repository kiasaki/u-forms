const {
    mapObjIndexed, merge, compose, not, contains, filter, curryN, __, pickAll,
} = require("ramda");

class Entity {
    constructor(params, skipDefaults) {
        const defaults = skipDefaults ? {} : (this.defaults || {});
        mapObjIndexed((v, k) => {
            this[k] = (typeof v === "function") ? v() : v;
        }, merge(defaults, params));
    }

    toJson(includePrivate) {
        const privFields = this.privateFields || [];
        const check = compose(not, contains);
        const fields = filter(curryN(2, check)(__, privFields), this.fields);
        return pickAll((includePrivate ? this.fields : fields), this);
    }

    toObject() {
        return this.toJson(true);
    }
}

Entity.newDate = function () {
    return new Date();
};

module.exports = Entity;
