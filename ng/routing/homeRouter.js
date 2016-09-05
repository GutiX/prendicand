var routerApp = angular.module('homeRouter', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            views: {
                'body': {
                    templateUrl: 'templates/bodyComponents/bhome.html'
                },
                'header': {
                    templateUrl: 'templates/commonComponents/headerIndex.html'
                }
            }
        })
        
        .state('carta', {
            url: '/carta',
            views: {
                'body': {
                    templateUrl: 'templates/bodyComponents/carta.html'
                },
                'header': {
                    templateUrl: 'templates/commonComponents/header.html'
                }
            }
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

});
