(function(){
    var events = ['click', 'mouseover', 'mousemove', 'mouseenter', 'mouseleave', 'mousedown', 'mouseup'];

    events.forEach(function(evt){
        Martin.prototype[evt] = function(cb) {

            var canvas = this;

            function callback(e) {
                cb(e);
                canvas.render();
            }

            this.canvas.addEventListener(evt, callback);
            return this;
        };
    });

    Martin.prototype.on = function(evt, cb) {

        var canvas = this;

        function callback(e) {
            cb(e);
            canvas.render();
        }

        if ( events.indexOf(evt) > -1 ) {
            this.canvas.addEventListener(evt, callback);
        }
        
        return this;
    };
})();
