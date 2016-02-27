module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const AngularSPA = require('nodal-angular').generate;

  class IndexController extends Nodal.Controller {

    get() {

      this.render(
        AngularSPA({
          api_url: Nodal.my.Config.secrets.api_url
        })
      );

    }

  }

  return IndexController;

})();
