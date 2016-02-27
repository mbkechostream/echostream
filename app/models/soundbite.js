module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');

  class Soundbite extends Nodal.Model {}

  Soundbite.setDatabase(Nodal.require('db/main.js'));
  Soundbite.setSchema(Nodal.my.Schema.models.Soundbite);

  const User = Nodal.require('app/models/user.js');
  Soundbite.joinsTo(User, {multiple: true});

  return Soundbite;

})();
