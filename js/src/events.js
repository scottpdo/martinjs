(function(){
    var events = ['click', 'mouseover', 'mousemove', 'mouseenter', 'mouseleave'];

    events.forEach(function(evt){
        Martin.prototype[evt] = function(cb) {
            this.canvas.addEventListener(evt, cb);
            return this;
        };
    });

    Martin.prototype.on = function(evt, cb) {
        if ( events.indexOf(evt) > -1 ) {
            this.canvas.addEventListener(evt, cb);
        }
        return this;
    };
})();
