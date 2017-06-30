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
            var authId = Math.floor((Math.random() * 1000000) + 1);
            this.clients.push({client: client, id: playerId, authId: authId});

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

            this.game.addPlayer(playerId, authId);

            client.on('leaveMatch', function(authId){
                ctx.removeClient(authId);
            });

            return authId;
        },

        /**
         * Remove a client from the game.
         *
         * @param {string} authId
         */
        removeClient: function(authId) {
            var l = this.clients.length;
            while (l--) {
                if (this.clients[l].authId === authId) {
                    console.log('Player [' + this.clients[l].id + '] has left match: [' + this.id + ']');
                    this.clients.splice(l, 1);
                    this.game.disconnectPlayer(authId);
                }
            }
        }
    };

    module.exports = {
        Match: Match
    };
}());
