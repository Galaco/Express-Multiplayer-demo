/**
 * Created by Josh on 27/06/2017.
 */

(function() {
    var GameObjects = require('./GameObjects');
    var MapBuilder = require('./Systems/MapBuilder');
    var PhysicsManager = require('./Systems/PhysicsManager');

    /**
     * Game object. This and all code underneath is really just example code to prove the multiplayer works.
     * @constructor
     */
    function Game() {
        this.players = [];
        var mapBuilder = new MapBuilder.MapBuilder(GameObjects);
        this.map = mapBuilder.constructMap();
        this.physicsManager = new PhysicsManager.PhysicsManager();
    }

    Game.prototype = {
        players: null,
        map: null,
        physicsManager: null,

        /**
         * Sync data that comes from the client
         * @param {Object} data
         */
        syncData: function(data) {
            //Sync the client player
            if (data.player) {
                var isNewPlayer = true;
                this.players.forEach(function(player) {
                   if (data.player.id === player.id) {
                       player.syncClientInput(data.player.input);
                       isNewPlayer = false;
                   }
                });
                if (isNewPlayer === true) {
                    this.players.push(new GameObjects.Player(data.player.id, data.player.position.x, data.player.position.y));
                }
            }
        },

        /**
         * Updates the game simulation.
         * The update rate is tied to the players, which isnt ideal, but
         * its tied to the fastest player for all, so there isnt really an unfair advantage.
         */
        think: function() {
            this.players.forEach(function(player) {
                player.think();
            });
            this.physicsManager.think(this.map, this.players);
        },

        /**
         * Get data to send to clients.
         *
         * @returns {{players: Array, map}}
         */
        getData: function() {
            var data = {
                players: [],
                map: this.map.getData()
            };
            this.players.forEach(function(player) {
                data.players.push(player.getClientModel());
            });

            return data;
        },

        /**
         * Remove a player from the match.
         *
         * @param playerId
         */
        disconnectPlayer: function(playerId) {
            this.players.forEach(function(player, index) {
                if (player.id === playerId) {
                    this.players.splice(index, 1);
                }
            }, this);
        }
    };

    module.exports = {
        Game: Game
    };
}());
