/**
 * Created by Josh on 27/06/2017.
 */

WINDOW_WIDTH = 1060;
WINDOW_HEIGHT = 548;

GAME_KEYMAP = {
    KeyW: 'KEY_UP',
    KeyA: 'KEY_LEFT',
    KeyS: 'KEY_DOWN',
    KeyD: 'KEY_RIGHT'
};


Game = function(playerId) {
    this.currentPlayerId = playerId;
};

Game.prototype = {
    renderer: null,
    physics: null,

    players: [],
    currentPlayerId: null,
    currentPlayer: null,

    map: null,

    setRenderer: function(renderer) {
        this.renderer = renderer;
    },

    setPhysicsManager: function(physics) {
        this.physics = physics;
    },

    render: function() {
        if (this.renderer) {
            this.renderer.clearContext();
            if (this.players) {
                this.renderer.renderPlayers(this.players);
            }
            if (this.map) {
                this.renderer.renderMap(this.map.getData());
            }
        }
    },

    update: function() {
        //Handle the simulation here.
        //This way we havent tied update rate to poll rate, so smoother visuals
        //Obviously sync would override any inconsistencies generated between polls
        var i = this.players.length;
        while (i--) {
            this.players[i].think();
        }
        if (this.map) {
            this.physics.think(this.map, this.players);
        }
    },

    fetchClientData: function() {
        var data = {};
        //Only send the clients data. No easily abusing other players!
        if (this.currentPlayer) {
            data.player = this.currentPlayer.getClientModel();
        }
        return data;
    },

    syncServerData: function(gameData) {
        //Sync players
        if (gameData.players) {
            //Check for new players
            var l = gameData.players.length;
            while (l--) {
                var isNewPlayer  = true;
                this.players.forEach(function(player) {
                    if (player.id === gameData.players[l].id) {
                        player.syncServerModel(gameData.players[l]);
                        isNewPlayer = false;
                    }
                }, this);
                if (isNewPlayer) {
                    this.players.push(new Player(gameData.players[l].id, false, gameData.players[l].position.x, gameData.players[l].position.y))
                }
            }
            //Check for disconnects
            l = this.players.length;
            while (l--) {
                var k = gameData.players.length,
                    stillConnected = false;
                while (k--) {
                    if (this.players[k].id === gameData.players[k].id) {
                        stillConnected = true;
                    }
                }
                //Player has disconnected
                if (!stillConnected) {
                    this.players.splice(index, 1);
                }
            }
        }
        //Sync other stuff
        if (gameData.map) {
            if (!this.map) {
                this.map = new Map(gameData.map);
                if (!this.currentPlayer) {
                    var spawn = this.map.requestPlayerSpawn();
                    this.currentPlayer = new Player(playerId, true, spawn.x*32, spawn.y*32);
                }
            } else {
                this.map.sync(gameData.map);
            }
        }
    }
};


//Player class
Player = function(playerId, isThisClient, x, y) {
    this.id = playerId;
    this.isThisClient = isThisClient;
    this.position = {x: x, y: y};
    this.velocity = {x: 0, y: 0};
    this.size = {x: 20, y: 20};
    this.input = [];

    if (isThisClient) {
        this._setupInputListeners();
    }
};

Player.prototype = {
    id: null,
    isThisClient: null,
    position: null,
    velocity: null,
    size: null,
    input: null,

    think: function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    },

    syncServerModel: function(model) {
        this.position = model.position;
        this.velocity = model.velocity;
    },

    getClientModel: function() {
        return {
            id: this.id,
            position: this.position,
            input: this.input
        };
    },

    _registerKeyPress: function(code) {
        var i = this.input.length;
        while (i--) {
            if (this.input[i] === code) {
                return;
            }
        }
        this.input.push(code);
    },

    _unregisterKeyPress: function(code) {
        var i = this.input.length;
        while (i--) {
            if (this.input[i] === code) {
                this.input.splice(i, 1);
                return;
            }
        }
    },

    _setupInputListeners: function() {
        var keyDown = function(event) {
            switch (event.code) {
                case 'KeyW':
                    this.velocity.y = -1;
                    break;
                case 'KeyA':
                    this.velocity.x = -1;
                    break;
                case 'KeyS':
                    this.velocity.y = 1;
                    break;
                case 'KeyD':
                    this.velocity.x = 1;
                    break;
            }
            this._registerKeyPress(event.code);
        };
        document.addEventListener('keydown', keyDown.bind(this));
        var keyUp = function(event) {
            switch (event.code) {
                case 'KeyW':
                    this.velocity.y = 0;
                    break;
                case 'KeyA':
                    this.velocity.x = 0;
                    break;
                case 'KeyS':
                    this.velocity.y = 0;
                    break;
                case 'KeyD':
                    this.velocity.x = 0;
                    break;
            }
            this._unregisterKeyPress(event.code);
        };
        document.addEventListener('keyup', keyUp.bind(this));

    }
};