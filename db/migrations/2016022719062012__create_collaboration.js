module.exports = (function() {

  "use strict";

  const Nodal = require('nodal');

  class CreateCollaboration extends Nodal.Migration {

    constructor(db) {
      super(db);
      this.id = 2016022719062012;
    }

    up() {

      return [
        this.createTable("collaborations", [{"name":"user_id","type":"int"},{"name":"soundbite_id","type":"int"}])
      ];

    }

    down() {

      return [
        this.dropTable("collaborations")
      ];

    }

  }

  return CreateCollaboration;

})();
