var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));


//Create node server
var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Server is running on port: %s', server.address().port);
});

var io = require('socket.io')(server);

var servers = [];


//Game code
var gameServer = require('./Game/Server.js');

io.on('connection', function(client) {
    console.log('User connected');

    //When a player request the server list
    client.on('requestMatchList', function() {
        var data = [],
            l = servers.length;
        while (l--) {
            data.push({'id': servers[l].id, 'name': servers[l].name});
        }
        client.emit('requestMatchList', data);
    });

    //Client wants to start a new match
    client.on('requestNewMatch', function(serverName) {
        if (!serverName) serverName = 'No Name';
        var game = new gameServer.GameServer(Math.floor((Math.random() * 100000) + 1), serverName);
        game.addClient(client);
        servers.push(game);
        client.emit('requestNewMatch', {'id': game.id, 'name': game.name});
    });

    //Put the client into the match. The game can handle the relevant events
    client.on('joinMatch', function(data) {
        if(data.matchId && data.playerId) {
            console.log('Player: [' + data.playerId + '] attempted to join match: [' + data.matchId + ']');
            var l = servers.length;
            //Ensure the match exists
            while (l--) {
                if (servers[l].id === parseInt(data.matchId)) {
                    //Add the player to the match and room
                    client.join('match_' + data.matchId);
                    servers[l].addPlayer(data.playerId);

                    //Broadcast the successfully joining
                    client.emit('matchJoined', data.matchId);
                }
            }
        }
    });
});

module.exports = app;