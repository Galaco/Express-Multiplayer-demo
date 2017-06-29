/**
 * Created by Josh on 27/06/2017.
 */

var GameObjects = require('./GameObjects');
var MapBuilder = require('./Systems/MapBuilder');

(function() {
    function Game() {
        this.players = [];
        var mapBuilder = new MapBuilder.MapBuilder();
        this.map = mapBuilder.constructMap();
    }

    Game.prototype = {
        players: null,
        map: null,

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

        think: function() {
            this.players.forEach(function(player) {
                player.think();
            });
        },

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
