const routes = require('next-routes')();

routes.add('/campaigns/new', '/campaigns/new')        // <-- para rutas que se solapan hay que declarar especificamente las que son 'fijas' ANTES que las que llevan param
      .add('/campaigns/:address', '/campaigns/show')
      .add('/campaigns/:address/requests', '/camapaigns/requests/index')
      .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;