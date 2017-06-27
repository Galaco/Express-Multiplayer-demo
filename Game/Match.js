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

            var ctx = this;
            client.on('sync', function(data) {
                //Handle gameplay sync
                if (ctx.game) {
                    ctx.game.syncData(data);
                    gameData = ctx.game.getData();
                }

                //Sync with clients
                client.emit('sync', gameData);
                client.broadcast.to('match_' + this.id).emit('sync', gameData);
            }, this);

            client.on('leaveMatch', function(playerId){
                ctx.clients.forEach(function(client, index) {
                    if (client.id === playerId) {
                        ctx.clients.splice(index, 1);
                        ctx.game.disconnectPlayer(playerId);
                        console.log(playerId + ' has left the game');
                    }
                });
            });
        }
    };

    module.exports = {
        Match: Match
    };
}());
