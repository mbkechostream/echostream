var app = angular
  .module('App', ['ui.router', 'ngMaterial'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
  });
