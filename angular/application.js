var app = angular
  .module('App', ['ui.router', 'ngMaterial', 'ngFileUpload'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
  });
