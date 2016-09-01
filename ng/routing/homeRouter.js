var routerApp = angular.module('homeRouter', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'templates/bodyComponents/bhome.html'
        })
        
        .state('myBeacons', {
            url: '/myBeacons',
            templateUrl: 'templates/bodyComponents/myBeacons.html'
        })
        
        .state('myBeaconTechnicalSettings', {
            url: '/myBeaconTechnicalSettings',
            templateUrl: 'templates/bodyComponents/myBeaconTechnicalSettings.html'
        })

        .state('myBeaconContent', {
            url: '/myBeaconContent',
            templateUrl: 'templates/bodyComponents/myBeaconContent.html'
        })

        .state('userProfile', {
            url: '/userProfile',
            templateUrl: 'templates/bodyComponents/userProfileInfo.html'
        })

        .state('places', {
            url: '/places',
            templateUrl: 'templates/bodyComponents/places.html'
        })

        .state('getStart', {
            url: '/getStart',
            templateUrl: 'templates/bodyComponents/getStart.html'
        })

});
