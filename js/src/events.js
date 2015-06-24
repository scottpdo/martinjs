(function(){
    var events = ['click', 'mouseover', 'mousemove', 'mouseenter', 'mouseleave', 'mouseout', 'mousedown', 'mouseup'];

    events.forEach(function(evt){
        Martin.prototype[evt] = function(cb) {

            function callback(e) {
                cb(e);
                this.render();
            }

            this.canvas.addEventListener(evt, callback.bind(this));
            return this;
        };
    });

    Martin.prototype.on = function(evt, cb) {

        evt = evt.split(' ');

        function callback(e) {
            cb(e);
            this.render();
        }

        evt.forEach(function(ev) {
            if ( events.indexOf(ev) > -1 ) {
                this.canvas.addEventListener(ev, callback.bind(this));
            }
        }, this);

        return this;
    };
})();
