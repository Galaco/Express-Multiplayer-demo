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
         * @param {Object} gameData
         */
        syncData: function(gameData) {
            data = gameData.data;
            //Sync the client player
            if (data.player) {
                this.players.forEach(function(player) {
                   if (gameData.authId === player.authId) {
                       player.syncClientInput(data.player.input);
                   }
                });
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

        addPlayer: function(playerId, authId) {
            var spawn = this.map.requestPlayerSpawn();
            var player = new GameObjects.Player(playerId, spawn.x*32, spawn.y*32);
            player.setAuthenticationId(authId);
            this.players.push(player);
        },

        /**
         * Remove a player from the match.
         *
         * @param {number} authId
         */
        disconnectPlayer: function(authId) {
            this.players.forEach(function(player, index) {
                if (player.authId === authId) {
                    this.players.splice(index, 1);
                }
            }, this);
        }
    };

    module.exports = {
        Game: Game
    };
}());
