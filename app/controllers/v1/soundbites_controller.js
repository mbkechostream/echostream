module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const Soundbite = Nodal.require('app/models/soundbite.js');

  class V1SoundbitesController extends Nodal.Controller {

    index() {

      Soundbite.query()
        .join('user')
        .where(this.params.query)
        .orderBy('id', 'DESC')
        .end((err, models) => {

		this.respond(err || models, ['id', 'raw_data', 'created_at', 'user', 'collaboration', 'title']);

        });

    }

    show() {

      Soundbite.find(this.params.route.id, (err, model) => {

        this.respond(err || model);

      });

    }

    create() {

      Soundbite.create(this.params.body, (err, model) => {

        this.respond(err || model);

      });

    }

    update() {

      Soundbite.update(this.params.route.id, this.params.body, (err, model) => {

        this.respond(err || model);

      });

    }

    destroy() {

      Soundbite.destroy(this.params.route.id, (err, model) => {

        this.respond(err || model);

      });

    }

  }

  return V1SoundbitesController;

})();
