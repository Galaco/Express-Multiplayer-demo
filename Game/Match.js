/**
 * Created by Josh on 26/06/2017.
 */

(function() {
    function Match(id, name) {
        this.id = id;
        this.name = name;

        this.clients = [];
    }

    Match.prototype = {
        id: null,
        name: null,
        clients: null,

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
                    //Run simulation
                    ctx.game.think();

                    //Sync with clients
                    gameData = ctx.game.getData();
                    client.emit('sync', gameData);
                    client.broadcast.to('match_' + this.id).emit('sync', gameData);
                }
            }, this);

            client.on('leaveMatch', function(playerId){
                ctx.removeClient(playerId);
            });
        },

        removeClient: function(playerId) {
            var l = this.clients.length;
            while (l--) {
                if (this.clients[l].id === playerId) {
                    console.log('Player [' + playerId + '] has left match: [' + this.id + ']');
                    this.clients.splice(l, 1);
                    this.game.disconnectPlayer(playerId);
                }
            }
        }
    };

    module.exports = {
        Match: Match
    };
}());
