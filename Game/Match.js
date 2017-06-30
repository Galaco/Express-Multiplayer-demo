/**
 * Created by Josh on 26/06/2017.
 */

(function() {
    /**
     * Match object. Game agnostic, so long as the game implements a few core functions
     *
     * @param {number} id
     * @param {string} name
     * @constructor
     */
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

        /**
         * Set the game to run under the match.
         *
         * @param {Game} game
         */
        setGame: function(game) {
          this.game = game;
        },

        /**
         * Add a client into the current match
         *
         * @param client
         * @param {string} playerId
         */
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

        /**
         * Remove a client from the game.
         *
         * @param {string} playerId
         */
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
