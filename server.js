'use strict';

var express = require('express');

//See https://github.com/websockets/ws
var WebSocket = require('ws');

var http_server = express();

//This resource makes it possible to download and start the WebSocket client
http_server.use(express.static(__dirname + "/../client"));

var ws_server = new WebSocket.Server({port: 3001});

ws_server.on('connection', (connection) => {
    console.log('Opened a connection');

    connection.on('message', (message) => {
        console.log("msg received from a client: " + message);

        ws_server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    connection.on('close', () => {
        console.log("Closed a connection");
    });

    connection.on('error', (error) => {
        console.error("Error: " + error.message);
    });
});

//Start the web server serving the WebSocket client
//Open http://localhost:3000 in a web browser
var server = http_server.listen(3000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
