/**
 * Created by Josh on 26/06/2017.
 */

var socket = io.connect('localhost:3000');

var playerId = '';
var game = '';


//Prep game after window ready
//Request server list
socket.on('requestMatchList', function(data) {
    var l = data.length;
    var node = $('#matchList');

    node.empty();
    if (l > 0) {
        while(l--) {
            var s = data[l];
            console.log(s);
            var match = '<div class="match" data-match-id="' + s.id + '">Id: ' + s.id + '</div>';
            node.append(match);
            node.find('.match:last-child').click(function(e) {
                playerId = $('#playerId').val();
                var matchId = $(e.currentTarget).attr('data-match-id');
                //Join match if name defined
                if (playerId.length > 0) {
                    socket.emit('joinMatch', {matchId: matchId, playerId: playerId});
                }
            });
        }
    } else {
        node.append('<div class="no-matches">No matches found.</div>');
    }
});
socket.on('requestNewMatch', function() {
    socket.emit('requestMatchList');
});
socket.on('matchJoined', function(matchId) {
    game = new Game(matchId, socket);
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
    socket.emit('leaveGame', game.matchId, playerId);
});

$(document).ready(function() {
    socket.emit('requestMatchList');
});