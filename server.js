var http = require('http');
app = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\nApp (dropball) is running on Node.JS ' + process.version);
}).listen(process.env['app_port'] || 3000);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

