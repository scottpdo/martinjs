var Element = require('./init.js');

module.exports = function registerElement(name, cb) {

    function attachRender(data) {

        // create new element
        var element = new Element(name, this, data);

        // attach render function (callback) --
        // execute with element's data
        element.renderElement = function renderElement() {

            var layer = this.layer,
                context = this.context;

            // clear any image data
            this.clear();

            // scale the context
            context.scale(
                layer.scale.x,
                layer.scale.y
            );

            context.beginPath();

            cb.call(element, this.data);

            this.setContext(this.data);

            context.closePath();

            // undo scaling
            context.scale(
                1 / layer.scale.x,
                1 / layer.scale.y
            );

            // render this element's effects
            Martin.utils.forEach(this.effects, function(effect) {
                effect.renderEffect && effect.renderEffect();
            });

            // draw to layer
            layer.context.drawImage(this.canvas, 0, 0);
        };

        return element;
    }

    Martin.prototype[name] = function registerToBase(data) {
        var el = attachRender.call(this, data);
        this.autorender();
        return el;
    };

    Martin.Layer.prototype[name] = function registerToLayer(data) {
        var el = attachRender.call(this.base, data);
        this.base.autorender();
        return el;
    };
};