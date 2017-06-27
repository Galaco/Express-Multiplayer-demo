/**
 * Created by Josh on 27/06/2017.
 */

var Player = require('./Objects/Player');

(function() {
    function Game() {
    }

    Game.prototype = {
        players: [],

        syncData: function(data) {
            //Sync the client player
            if (data.player) {
                var isNewPlayer = true;
                this.players.forEach(function(player) {
                   if (data.player.id === player.id) {
                       player.x = data.player.x;
                       player.y = data.player.y;
                       isNewPlayer = false;
                   }
                });
                if (isNewPlayer === true) {
                    this.players.push(new Player.Player(data.player.id, data.player.x, data.player.y));
                }
            }
        },

        getData: function() {
            var data = {
                players: []
            };
            this.players.forEach(function(player) {
               data.players.push({id: player.id, x: player.x, y: player.y});
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
