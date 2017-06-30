/**
 * Created by Josh on 29/06/2017.
 */

(function() {
    var MAP_SQUARE_EMPTY = 0;
    var MAP_SQUARE_BREAKABLE = 1;
    var MAP_SQUARE_UNBREAKABLE = 2;
    var MAP_SQUARE_BROKEN = 3;

    /**
     * Builds a map
     *
     * @param {Object} gameObjects
     * @constructor
     */
    function MapBuilder(gameObjects) {
        this.objects = gameObjects;
    }

    MapBuilder.prototype = {
        objects: null,

        /**
         * Constructs a map (hardcoded because this isnt currently important.
         *
         * @returns {Map}
         */
        constructMap: function() {
            //No random generation yet!
            var grid = [
                2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
                2,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,
                2,0,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,0,2,
                2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,
                2,0,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,0,2,
                2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
                2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
                2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
                2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,0,2,0,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
                2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
                2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,
                2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,
                2,0,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,0,2,
                2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,
                2,0,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,0,2,
                2,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,
                2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2
            ];

            return new Map(grid, this.objects);
        }
    };

    /**
     * Map object, store map data.
     *
     * @param {Array} grid
     * @param {Object} objects
     * @constructor
     */
    function Map(grid, objects) {
        this.typeGrid = grid;
        this.width = 33;
        this.height = 17;
        this.grid = [];

        this.buildObjects(objects);
    }

    Map.prototype = {
        typeGrid: null,
        grid: null,

        /**
         * Return map object types
         *
         * @returns {Array}
         */
        getData: function() {
            return this.typeGrid;
        },

        /**
         * Build the internal map data.
         *
         * @param {function} objects
         */
        buildObjects: function(objects) {
            this.typeGrid.forEach(function(type, index) {
                if (type === MAP_SQUARE_EMPTY) {
                    this.grid.push(null);
                } else {
                    this.grid.push(
                        new objects.Block(
                            index % this.width,
                            Math.floor(index / this.width),
                            type
                        )
                    );
                }
            }, this);
        }
    };

    module.exports = {
        MapBuilder: MapBuilder,
        Map: Map
    };
}());
