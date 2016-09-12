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

        .state('programa', {
            url: '/programa',
            views: {
                'body': {
                    templateUrl: 'templates/bodyComponents/programa.html'
                },
                'header': {
                    templateUrl: 'templates/commonComponents/header.html'
                }
            }
        })

        .state('candidatos', {
            url: '/candidatos',
            views: {
                'body': {
                    templateUrl: 'templates/bodyComponents/candidatos.html'
                },
                'header': {
                    templateUrl: 'templates/commonComponents/header.html'
                }
            }
        })

        .state('historia', {
            url: '/historia',
            views: {
                'body': {
                    templateUrl: 'templates/bodyComponents/historia.html'
                },
                'header': {
                    templateUrl: 'templates/commonComponents/header.html'
                }
            }
        })

});
