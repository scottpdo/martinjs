var events = ['click', 'mouseover', 'mousemove', 'mouseenter', 'mouseleave', 'mouseout', 'mousedown', 'mouseup'];

function EventCallback(base, cb) {
    return {
        base: base,
        cb: cb,
        exec: function exec(e) {
            var eventObj = e;

            eventObj.x = e.offsetX ? e.offsetX : e.clientX - base.canvas.getBoundingClientRect().left;
            eventObj.y = e.offsetY ? e.offsetY : e.clientY - base.canvas.getBoundingClientRect().top;

            cb(eventObj);
            base.autorender();
        }
    };
}

events.forEach(function(evt){
    Martin.prototype[evt] = function(cb) {

        var callback = EventCallback(this, cb);

        this.canvas.addEventListener(evt, callback.exec);
        return this;
    };
});

Martin.prototype.on = function(evt, cb) {

    evt = evt.split(' ');

    evt.forEach(function(ev) {
        var callback = EventCallback(this, cb);
        if ( events.indexOf(ev) > -1 ) {
            this.canvas.addEventListener(ev, callback.exec);
        }
    }, this);

    return this;
};
