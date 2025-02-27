var http = require("http");

http.createServer(function (req, res) {    
    res.write('Starting a base!');
    res.end();
}).listen(8000);