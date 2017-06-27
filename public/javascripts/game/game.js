/**
 * Created by Josh on 27/06/2017.
 */

WINDOW_WIDTH = 998;
WINDOW_HEIGHT = 548;

Game = function(playerId) {
    this.currentPlayer = new Player(playerId, true, (Math.random() * WINDOW_WIDTH) + 1, (Math.random() * WINDOW_HEIGHT) + 1);
    this.players.push(this.currentPlayer);
};

Game.prototype = {
    renderer: null,

    players: [],
    currentPlayer: null,

    setRenderer: function(renderer) {
        this.renderer = renderer;
    },

    render: function() {
        if (this.renderer) {
            var data = {
              players: this.players
            };

            this.renderer.render(data);
        }
    },

    update: function() {
        //Handle the simulation here.
        //Obviously sync would override any inconsistencies
    },

    fetchClientData: function() {
        var data = {};
        //Only send the clients data. No easily abusing other players!
        data.player = {
            id: this.currentPlayer.id,
            x: this.currentPlayer.x,
            y: this.currentPlayer.y
        };
        return data;
    },

    syncServerData: function(gameData) {
        //Sync players
        if (gameData.players) {
            var l = gameData.players.length;
            while (l--) {
                var f  = false;
                this.players.forEach(function(player) {
                    if (player.id === gameData.players[l].id) {
                        player.x = gameData.players[l].x;
                        player.y = gameData.players[l].y;
                        f = true;
                    }
                }, this);
                //Check for disconnects
                this.players.forEach(function(player, index) {
                    var l = gameData.players.length,
                        f = false;
                    while (l--) {
                        if (player.id === gameData.players[l].id) {
                            f = true;
                        }
                    }
                    //Player has disconnected
                    if (!f) {
                        this.players.splice(index, 1);
                    }
                }, this);
                if (!f) {
                    this.players.push(new Player(gameData.players[l].id, false, gameData.players[l].x, gameData.players[l].y))
                }
            }
        }
        //Sync other stuff
    }
};


//Player class
Player = function(playerId, isThisClient, x, y) {
    this.id = playerId;
    this.isThisClient = isThisClient;
    this.x = x;
    this.y = y;
};

Player.prototype = {
    id: null,
    isThisClient: false,
    x: null,
    y: null
};