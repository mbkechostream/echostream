module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');

  class Collaboration extends Nodal.Model {}

  Collaboration.setDatabase(Nodal.require('db/main.js'));
  Collaboration.setSchema(Nodal.my.Schema.models.Collaboration);

  const User = Nodal.require('app/models/user.js');
  Collaboration.joinsTo(User);

  return Collaboration;

})();
