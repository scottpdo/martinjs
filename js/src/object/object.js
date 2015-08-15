// shared methods for objects: layers, elements, effects

Martin.Object = function() {};
var ObjMethods,
    ObjMethod;

ObjMethods = {

    stackIndex: function() {
        return this.stack.indexOf(this);
    },

    remove: function() {
        this.stack.splice(this.stackIndex(), 1);
        this.base.autorender();
        return this;
    },

    bump: function(i) {
        var index = this.stackIndex();
        this.remove();
        this.stack.splice(index + i, 0, this);
        this.base.autorender();
        return this;
    },

    bumpUp: function() {
        return this.bump(1);
    },

    bumpDown: function() {
        return this.bump(-1);
    },

    bumpToTop: function() {
        this.remove();
        this.stack.push(this);
        this.base.autorender();
        return this;
    },

    bumpToBottom: function() {
        this.remove();
        this.stack.unshift(this);
        this.base.autorender();
        return this;
    },
};

for ( ObjMethod in ObjMethods ) {
    Martin.Object.prototype[ObjMethod] = ObjMethods[ObjMethod];
}
