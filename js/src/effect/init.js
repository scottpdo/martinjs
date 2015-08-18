/*

    Martin.Effect constructor

    Effect methods:
    .increase()
    .decrease()
*/

function registerEffect(name, cb) {

    function attachRender(data, stack, stackContainer) {

        // create new effect
        var effect = new Martin.Effect(name, this, data, stack, stackContainer);

        // attach render function (callback) --
        // execute with effect's data
        effect.renderEffect = function renderEffect() {
            cb.call(effect, this.data);
        };

        return effect;
    }

    Martin.prototype[name] = function attachToBase(data) {
        var effect = attachRender.call(this, data, this.currentLayer.effects, this.currentLayer);
        this.autorender();
        return effect;
    };

    Martin.Layer.prototype[name] =
    Martin.Element.prototype[name] = function attachToLayerOrElement(data) {
        var effect = attachRender.call(this.base, data, this.effects, this);
        this.base.autorender();
        return effect;
    };
};

Martin.registerEffect = registerEffect;

Martin.Effect = function(type, base, data, stack, stackContainer) {

    this.base = base;
    this.type = type;

    this.data = data;

    this.context = stackContainer;

    this.stack = stack;
    this.stack.push(this);

    return this;
};

Martin.Effect.prototype = Object.create(Martin.Object.prototype);

// Adjust the intensity of an Effect (linear effects only)
Martin.Effect.prototype.increase = function(amt) {

    if ( typeof this.data === 'number' ) {
        this.data += amt || 1;
        this.base.autorender();
    }

    return this;
};

Martin.Effect.prototype.decrease = function(amt) {
    return this.increase(-amt || -1);
};
