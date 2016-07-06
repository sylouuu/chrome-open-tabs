var app = angular.module('OpenTabs', ['ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial', 'angular-google-analytics']);

app.config(['$routeProvider', '$compileProvider', '$mdIconProvider', '$mdThemingProvider', 'AnalyticsProvider', function ($routeProvider, $compileProvider, $mdIconProvider, $mdThemingProvider, AnalyticsProvider) {

    // Allow "chrome-extension" protocol
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|blob:chrome-extension|file|blob):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|chrome-extension|file|blob):|data:image\//);

    // Load icons list by name
    $mdIconProvider
        .icon('arrow-right', '/icons/arrow-right.svg')
        .icon('close', '/icons/close.svg')
        .icon('content-duplicate', '/icons/content-duplicate.svg')
        .icon('credit-card', '/icons/credit-card.svg')
        .icon('dots-horizontal', '/icons/dots-horizontal.svg')
        .icon('dots-vertical', '/icons/dots-vertical.svg')
        .icon('github-circle', '/icons/github-circle.svg')
        .icon('google-chrome', '/icons/google-chrome.svg')
        .icon('magnify', '/icons/magnify.svg')
        .icon('pin', '/icons/pin.svg')
        .icon('pin-off', '/icons/pin-off.svg')
        .icon('refresh', '/icons/refresh.svg')
        .icon('reload', '/icons/reload.svg')
        .icon('save', '/icons/content-save.svg')
        .icon('settings', '/icons/settings.svg');

    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue', {
            default: '600'
        })
        .accentPalette('yellow', {
            default: '700'
        })
        .warnPalette('red', {
            default: 'A700'
        });

    // Analytics config
    AnalyticsProvider.setAccount('UA-27524593-8');
    AnalyticsProvider.setHybridMobileSupport(true);
    AnalyticsProvider.setDomainName('none');

    var routes = {
        '/:event?/:version?': {
            templateUrl: '/html/home.min.html',
            controller: 'HomeController'
        }
    };

    for (var path in routes) {
        if (routes.hasOwnProperty(path)) {
            $routeProvider.when(path, routes[path]);
        }
    }

}]);

app.run(['Analytics', function (Analytics) {

}]);

app.filter('searchFilter', function () {
    return function (items, query) {
        if (query === null || query === '') {
            return items;
        }

        query = query.toLowerCase();

        var filtered = [];

        angular.forEach(items, function (item) {
            if (item.title.toLowerCase().indexOf(query) !== -1 || item.url.toLowerCase().indexOf(query) !== -1) {
                filtered.push(item);
            }
        });

        return filtered;
    };
});
