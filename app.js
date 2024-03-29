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

//Main match storage. All existing matches live here
var matches = [];

var GameMatch = require('./Game/Match.js');
var Game = require('./Game/Game.js');

//Handle main lobby connections.
//A client isn't considered a true client until they join a match
io.on('connection', function(client) {
    console.log('User connected');

    //When a player request the server list
    client.on('requestMatchList', function() {
        var data = [],
            l = matches.length;
        while (l--) {
            data.push({'id': matches[l].id, 'name': matches[l].name, 'clients': matches[l].clients.length});
        }
        client.emit('requestMatchList', data);
    });

    //Client wants to start a new match
    client.on('requestNewMatch', function(serverName) {
        if (!serverName) serverName = 'No Name';
        var match = new GameMatch.Match(Math.floor((Math.random() * 100000) + 1), serverName);
        //Set match game
        match.setGame(new Game.Game());
        matches.push(match);
        client.emit('requestNewMatch', {'id': match.id, 'name': match.name});
    });

    //Put the client into the match. The game can handle the relevant events
    client.on('joinMatch', function(data) {
        if(data.matchId && data.playerId) {
            var l = matches.length;
            //Ensure the match exists
            while (l--) {
                if (matches[l].id === parseInt(data.matchId)) {
                    //Add the player to the match and room
                    client.join('match_' + data.matchId);
                    var authId = matches[l].addClient(client, data.playerId);

                    //Broadcast the successfully joining
                    client.emit('matchJoined', {matchId: data.matchId, authId: authId});
                    console.log('Player: [' + data.playerId + '] has joined match: [' + data.matchId + ']');
                }
            }
        }
    });
});

module.exports = app;