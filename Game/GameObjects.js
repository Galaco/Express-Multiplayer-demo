/**
 * Created by Josh on 27/06/2017.
 */

PLAYER_KEYMAP = {
    PLAYER_MOVE_UP: 'KeyW',
    PLAYER_MOVE_LEFT: 'KeyA',
    PLAYER_MOVE_DOWN: 'KeyS',
    PLAYER_MOVE_RIGHT: 'KeyD'
};

PLAYER_MAX_VELOCITY = 2;

(function() {
    function Player(id, x, y) {
        this.id = id;
        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};
        this.input = [];
    }

    Player.prototype = {
        id: null,
        position: null,
        velocity: null,
        input: null,

        //For now we implicity trust the client data.
        //In a 'real life' scenario NEVER EVER EVER DO SO
        syncClientInput: function(model) {
            this.input = model;
        },

        getClientModel: function() {
            return {
                id:  this.id,
                position: this.position,
                velocity: this.velocity
            };
        },

        think: function() {
            this._processInput();

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        },

        _processInput: function() {
            if(this.input.includes(PLAYER_KEYMAP.PLAYER_MOVE_UP)) {
                if (this.velocity.y > -1 * PLAYER_MAX_VELOCITY) {
                    this.velocity.y--;
                }
            } else if (this.velocity.y === -1 * PLAYER_MAX_VELOCITY) {
                this.velocity.y = 0;
            }
            if(this.input.includes(PLAYER_KEYMAP.PLAYER_MOVE_LEFT)) {
                if (this.velocity.x > -1 * PLAYER_MAX_VELOCITY) {
                    this.velocity.x--;
                }
            } else if (this.velocity.x === -1 * PLAYER_MAX_VELOCITY) {
                this.velocity.x = 0;
            }

            if(this.input.includes(PLAYER_KEYMAP.PLAYER_MOVE_DOWN)) {
                if (this.velocity.y < PLAYER_MAX_VELOCITY) {
                    this.velocity.y++;
                }
            } else if (this.velocity.y === PLAYER_MAX_VELOCITY) {
                this.velocity.y = 0;
            }
            if(this.input.includes(PLAYER_KEYMAP.PLAYER_MOVE_RIGHT)) {
                if (this.velocity.x < PLAYER_MAX_VELOCITY) {
                    this.velocity.x++;
                }
            } else if (this.velocity.x === PLAYER_MAX_VELOCITY) {
                this.velocity.x = 0;
            }
        }
    };

    module.exports = {
        Player: Player
    };
}());
