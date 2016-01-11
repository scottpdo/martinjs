var express = require('express'),
	path = require('path'),
	PORT = process.env.PORT || 8000,
	imgUrl = 'http://lorempixel.com/800/600/animals/',
	gm = require('gm'),
	app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	var img = gm(imgUrl).stream(function(err, stdout) {
		stdout.pipe(res);
	});
});

app.use(function(req, res) {
    res.status(404).send('Page not found');
});

module.exports = {
    start: function() {
        app.listen(PORT);
        console.log('Started server on port', PORT);
    }
};