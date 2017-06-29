/**
 * Created by Josh on 26/06/2017.
 */

var socket = io.connect('localhost:3000');

var playerId = '';
var match = null;


//Prep game after window ready
//Request server list
socket.on('requestMatchList', function(data) {
    var l = data.length;
    var node = $('#matchList');

    node.empty();
    if (l > 0) {
        while(l--) {
            var s = data[l];
            var match = '<div class="match" data-match-id="' + s.id + '"><p>Id: ' + s.id + '</p><p>Players:' + s.clients + '</p></div>';
            node.append(match);
            node.find('.match:last-child').click(function(e) {
                playerId = $('#playerId').val();
                var matchId = $(e.currentTarget).attr('data-match-id');
                //Join match if name defined
                if (playerId.length > 0) socket.emit('joinMatch', {matchId: matchId, playerId: playerId});
            });
        }
    } else {
        node.append('<div class="no-matches">No matches found.</div>');
    }
});
socket.on('requestNewMatch', function(match) {
    socket.emit('requestMatchList');
    playerId = $('#playerId').val();
    if (playerId.length > 0) socket.emit('joinMatch', {matchId: match.id, playerId: playerId});
});
socket.on('matchJoined', function(matchId) {
    if (match !== null) {
        socket.emit('leaveMatch', playerId);
    }


    match = new Match(matchId, socket);

    var game = new Game(playerId);
    game.setRenderer(new Renderer('gameWindow'));
    game.setPhysicsManager(new PhysicsManager());

    match.setGame(game);

    socket.emit('requestMatchList');
});

//Interface listeners
$('#refreshMatchList').on('click', function(e) {
    socket.emit('requestMatchList');
});
$('#newMatch').on('click', function(e) {
    socket.emit('requestNewMatch');
});


//Make sure to handle disconnecting
$(window).on('beforeunload', function(){
    socket.emit('leaveMatch', playerId);
});

$(document).ready(function() {
    socket.emit('requestMatchList');
});