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
        templateUrl: 'pages/root/login/template.html'
      }
    )

    .state(
      'root.create',
      {
        url: '/create',
        templateUrl: 'pages/root/create/template.html'
      }
    )

    .state(
      'root.echoes',
    	{
      	url: '/echoes',
      	templateUrl: 'pages/root/echoes/template.html'
      }
    )

    .state(
      'root.topics',
      {
        url: '/topics',
        templateUrl: 'pages/root/topics/template.html'
      }
    )

  $urlRouterProvider.otherwise('/');

});
