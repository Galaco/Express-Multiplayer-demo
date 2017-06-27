/**
 * Created by Josh on 26/06/2017.
 */

(function() {
    function Match(id, name, game) {
        this.id = id;
        this.name = name;
    }

    Match.prototype = {
        id: null,
        name: null,
        clients: [],

        game: null,

        setGame: function(game) {
          this.game = game;
        },

        addClient: function(client, playerId) {
            this.clients.push({client: client, id: playerId});

            client.on('sync', function(data) {
                var gameData = {};
                //Handle gameplay sync
                if (this.game) {
                    this.game.syncData(data);
                    gameData = this.game.getData();
                }

                //Sync with clients
                client.emit('sync', gameData);
                client.broadcast.to('match_' + this.id).emit('sync', gameData);
            });

            client.on('leaveMatch', function(playerId){
                console.log(playerId + ' has left the game');
            });
        }
    };

    module.exports = {
        Match: Match
    };
}());
