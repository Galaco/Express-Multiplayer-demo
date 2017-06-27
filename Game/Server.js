/**
 * Created by Josh on 26/06/2017.
 */

(function() {
    function GameServer(id, name) {
        this.id = id;
        this.name = name;
    }

    GameServer.prototype = {
        id: null,
        name: null,
        clients: [],

        addClient: function(client) {
            this.clients.forEach(function(c) {
                if (c == client) return;
            });
            this.clients.push(client);
        }
    };

    module.exports = {
      GameServer: GameServer
    };
}());
