module.exports = (() => {

  'use strict';

  const Nodal = require('nodal');
  const daemon = new Nodal.Daemon();

  const AngularInitializer = require('nodal-angular').Initializer;

  daemon.initializers.use(AngularInitializer);

  return daemon;

})();
