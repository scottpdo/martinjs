module.exports = function(original, options) {
	return {
		init: function() {
			if (original) {
				var canvas = document.createElement('canvas'),
					context = canvas.getContext('2d');
				context.drawImage(original, 0, 0);
				original.parentNode.appendChild(canvas);
			}
		},
		render: function() {
			// window.requestAnimationFrame(this.render);
		}
	};
};