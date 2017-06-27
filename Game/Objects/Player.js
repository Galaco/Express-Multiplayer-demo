/**
 * Created by Josh on 27/06/2017.
 */

(function() {
    function Player(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    Player.prototype = {
        id: null,

        x: null,
        y: null,
    };

    module.exports = {
        Player: Player
    };
}());
