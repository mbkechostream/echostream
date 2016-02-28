module.exports = (function() {

  "use strict";

  const Nodal = require('nodal');

  class CreateSoundbite extends Nodal.Migration {

    constructor(db) {
      super(db);
      this.id = 2016022718195631;
    }

    up() {

      return [
        this.createTable("soundbites", [{"name":"user_id","type":"int"},{"name":"raw_data","type":"string"},{"name":"title","type":"string"}])
      ];

    }

    down() {

      return [
        this.dropTable("soundbites")
      ];

    }

  }

  return CreateSoundbite;

})();
