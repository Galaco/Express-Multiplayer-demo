/**
 * Created by Josh on 29/06/2017.
 */



Map = function(grid) {
    this.typeGrid = grid;

    this.build();
};

Map.prototype = {
    //Hardcoded for now
    width: 33,
    height: 17,
    MAP_SQUARE_EMPTY: 0,
    MAP_SQUARE_BREAKABLE: 1,
    MAP_SQUARE_UNBREAKABLE: 2,
    MAP_SQUARE_BROKEN: 3,

    typeGrid: [],
    grid: [],

    build: function() {
        this.typeGrid.forEach(function(type, index) {
            if (type === this.MAP_SQUARE_EMPTY) {
                this.grid.push(null);
            } else {
                this.grid.push(
                    new Block(
                        index % this.width,
                        Math.floor(index / this.width),
                        type
                    )
                );
            }
        }, this);
    },

    sync: function(mapData) {
        var l = mapData.length;
        while (l--) {
            if (mapData[l] === this.MAP_SQUARE_BROKEN) {
                if (this.grid[index].type !== type) {
                    this.grid[index] = null;
                }
            }
        }
    },

    requestPlayerSpawn: function() {
        var possibleSpawns = [],
            l = this.typeGrid.length;
        while (l--) {
            if (this.typeGrid[l] === this.MAP_SQUARE_EMPTY) {
                possibleSpawns.push(l);
            }
        }
        var chosen = possibleSpawns[Math.floor(Math.random() * possibleSpawns.length)];
        return {x: chosen % this.width, y: Math.floor(chosen / this.width)};
    },

    getData: function() {
        return this.grid;
    }
};


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


PhysicsManager = function() {
    this.mapSize = {x: null, y: null};
};

PhysicsManager.prototype = {
    mapSize: null,

    think: function(map, players) {
        //Size will not change midgame
        if (this.mapSize.x === null) {
            this.mapSize.x = map.width;
            this.mapSize.y = map.height;
        }

        var i = players.length;
        while (i--) {
            var index = this._determineGridIndexFromPosition(players[i].position),
                objectIndexes = this._determineNearbyObjectIndexes(index),
                j = objectIndexes.length;

            while (j--) {
                if (this._testCollision(players[i], map.grid[objectIndexes[j]])) {
                    console.log('Collision!');
                    //Need to move the player back again
                    players[i].position.x -= players[i].velocity.x;
                    players[i].position.y -= players[i].velocity.y;
                }
            }
        }
    },

    _determineGridIndexFromPosition: function(position) {
        var x = Math.floor(position.x / 32);
        return x + (this.mapSize.x * Math.floor(position.y / 32));
    },

    _determineNearbyObjectIndexes: function(index) {
        //Since its aabb and velocity is waaay small we only care about Current + LRUD objects
        return [
            index,                  // current
            index - 1, // left
            index - this.mapSize.x, //up
            index + 1, //right
            index + this.mapSize.x  //down
        ];
    },

    //Fix me
    _testCollision: function(a, b) {
        //There is an empty square
        if (b === null || b === undefined) {
            return false;
        }
        //X Axis collision
        var x = (
            a.position.x < b.position.x + b.size.x &&
            b.position.x > a.position.x + a.size.x
        );
        //Y Axis collision
        var y = (
            a.position.y <= b.position.y + b.size.y &&
            b.position.y >= a.position.y + a.size.y
        );

        //Both axis collision
        return (x && y);
    }
};