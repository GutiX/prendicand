var routerApp = angular.module('indexRouter', ['ui.router', 'tokenInterceptor', 'auth', 'user']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('index');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('index', {
            url: '/index',
            templateUrl: 'templates/bodyComponents/login-register.html'
        })
        
        .state('restorePass', {
            url: '/restorePass',
            templateUrl: 'templates/bodyComponents/restorePass.html'
        })

        .state('recoverPass', {
            url: '/recoverPass',
            templateUrl: 'templates/bodyComponents/recoverPass.html'
        })
        
        .state('terms', {
            url: '/terms',
            templateUrl: 'templates/commonComponents/terms.html'
        })

        .state('accessibility', {
            url: '/accessibility',
            templateUrl: 'templates/commonComponents/accessibility.html'
        })

        .state('legal', {
            url: '/legal',
            templateUrl: 'templates/commonComponents/legal.html'
        })

        .state('privacy', {
            url: '/privacy',
            templateUrl: 'templates/commonComponents/privacy.html'
        })

        .state('cookies', {
            url: '/cookies',
            templateUrl: 'templates/commonComponents/cookies.html'
        })

});