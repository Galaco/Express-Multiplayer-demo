/**
 * Created by Josh on 29/06/2017.
 */

(function() {
    /**
     * Collision management class. Not *really* physics.
     *
     * @constructor
     */
    PhysicsManager = function() {
        this.mapSize = {x: null, y: null};
        this.solidTypes = [1,2];
    };

    PhysicsManager.prototype = {
        mapSize: null,
        solidTypes: null,

        /**
         * Checks for collisions.
         *
         * @param {array} map
         * @param {array} players
         */
        think: function(map, players) {
            //Size will not change midgame
            if (this.mapSize.x === null) {
                this.mapSize.x = map.width;
                this.mapSize.y = map.height;
            }

            var i = players.length;
            while (i--) {
                var index = this._determineGridIndexFromPosition(players[i].position),
                    objectIndexes = this._determineNearbyObjectIndexes(index, players[i].velocity),
                    j = objectIndexes.length;

                while (j--) {
                    if (this._testCollision(players[i], map.grid[objectIndexes[j]]) === true) {
                        //Need to move the player back again
                        players[i].handleCollision();
                    }
                }
            }
        },

        /**
         * Get the map grid index from the players X,Y position.
         *
         * @param position
         * @returns {number}
         * @private
         */
        _determineGridIndexFromPosition: function(position) {
            var x = Math.floor(position.x / 32);
            return x + (this.mapSize.x * Math.floor(position.y / 32));
        },

        /**
         * Get nearby map objects indexes from the players direction and index.
         *
         * @param {number} index
         * @param {Object} velocity
         * @returns {[*]}
         * @private
         */
        _determineNearbyObjectIndexes: function(index, velocity) {
            var i = [index];
            //determine direction of motion
            if (velocity.x !== 0) {
                if (velocity.x > 0) {
                    i.push(index + 1);
                    //right
                } else {
                    //left
                    i.push(index - 1);
                }
            }
            if (velocity.y !== 0) {
                if (velocity.y > 0) {
                    //down
                    i.push(index + this.mapSize.x);
                } else {
                    //up
                    i.push(index - this.mapSize.x);
                }
            }
            return i;
        },

        /**
         * Test for a collision between a player and a block.
         *
         * @param {Player} a
         * @param {Block|null} b
         * @returns {boolean}
         * @private
         */
        _testCollision: function(a, b) {
            if (!b) {
                return false;
            }

            if (this.solidTypes.indexOf(b.type) <= -1) {
                return false;
            }

            //X Axis collision
            var x = (
                a.position.x < b.position.x + b.size.x &&
                b.position.x < a.position.x + a.size.x
            );
            //Y Axis collision
            var y = (
                a.position.y <= b.position.y + b.size.y &&
                b.position.y <= a.position.y + a.size.y
            );

            return (x && y);
        }
    };

    module.exports = {
        PhysicsManager: PhysicsManager
    };
}());
