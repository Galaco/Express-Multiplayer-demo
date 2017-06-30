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
    /**
     * Player within the game.
     *
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @constructor
     */
    function Player(id, x, y) {
        this.id = id;
        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};
        this.input = [];
        this.size = {x: 20, y: 20};
    }

    Player.prototype = {
        id: null,
        position: null,
        velocity: null,
        input: null,
        size: null,

        /**
         * Sync client input data.
         * We implicity trust the clients data here, because its only keypresses.
         *
         * @param {Array} model
         */
        syncClientInput: function(model) {
            this.input = model;
        },

        /**
         * Returns all the player data that clients require to continue local simulation.
         *
         * @returns {{id: *, position: *, velocity: *}}
         */
        getClientModel: function() {
            return {
                id:  this.id,
                position: this.position,
                velocity: this.velocity
            };
        },

        /**
         * Update player information.
         * Results generated are synced with client, as the server model should be the trusted one.
         */
        think: function() {
            this._processInput();

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        },

        /**
         * Handle when a player collides with an object.
         * Basically step back a tick.
         */
        handleCollision: function() {
            this.position.x -= this.velocity.x;
            this.position.y -= this.velocity.y;
        },

        /**
         * Handle client input data that affects the player model.
         *
         * @private
         */
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


    /**
     * Simple block object.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} type
     * @constructor
     */
    Block = function(x, y, type) {
        this.size = {x: 32, y: 32};
        this.position = {x: x * this.size.x, y: y * this.size.y};
        this.grid = {x: x, y: y};
        this.isBreakable = (type === this.MAP_SQUARE_BREAKABLE);
        this.type = type;
    };

    Block.prototype = {
        position: null,
        grid: null,
        isBreakable: false,
        type: 1,
        size: null
    };

    module.exports = {
        Player: Player,
        Block: Block
    };
}());
