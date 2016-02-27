app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider

    .state(
      'root',
      {
        templateUrl: 'pages/root/template.html',
      }
    )

      .state(
        'root.index',
        {
          url: '/',
          templateUrl: 'pages/root/index/template.html'
        }
      )

      .state(
        'root.create',
        {
          url: '/create',
          templateUrl: 'pages/root/create/template.html'
        }
      )

  $urlRouterProvider.otherwise('/');

});
