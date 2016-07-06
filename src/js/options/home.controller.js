app.controller('HomeController', ['$scope', '$routeParams', '$location', '$mdDialog', '$mdToast', 'Analytics', function ($scope, $routeParams, $location, $mdDialog, $mdToast, Analytics) {

    // ---------------------------------------------------------------------------------
    // Actions

    $scope.closeAllTabs = function (tabs, evt) {
        if (tabs.code === 'PINNED_TABS') {
            var confirm = $mdDialog
                .confirm()
                .clickOutsideToClose(false)
                .title('Close all')
                .textContent('Do you really want to close all pinned tabs?')
                .ariaLabel('Close all')
                .targetEvent(evt)
                .ok('Close all')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                $scope.removeAllTabs(tabs);
            });
        } else {
            $scope.removeAllTabs(tabs);
        }
    };

    $scope.removeAllTabs = function (tabs) {
        var ids = [];

        angular.forEach(tabs.data, function (tab) {
            ids.push(tab.id);
        });

        chrome.tabs.remove(ids);
    };

    $scope.goToTab = function (tab) {
        chrome.tabs.update(tab.id, { active: true, highlighted: true });
    };

    $scope.removeTab = function (tab) {
        chrome.tabs.remove(tab.id);
    };

    $scope.reloadTab = function (tab) {
        chrome.tabs.reload(tab.id);
    };

    $scope.duplicateTab = function (tab) {
        chrome.tabs.create({ url: tab.url, active: false, pinned: tab.pinned, index: tab.index + 1 });
    };

    $scope.pinOrUnpinTab = function (tab, pinned) {
        chrome.tabs.update(tab.id, { pinned: pinned });
    };

    // --------------------------------------------------------------------------------------------------------
    // Events

    // New install
    if ($routeParams.event === 'install') {
        var alert = $mdDialog
            .alert()
            .clickOutsideToClose(true)
            .title('Greetings')
            .textContent('Hello, thank you for installing Open Tabs!')
            .ariaLabel('Greetings')
            .targetEvent()
            .ok('Ok');

        $mdDialog.show(alert).then(function () {
            Analytics.trackEvent('greetings-dialog', 'close');

            $location.path('/');
        }, function () {
            Analytics.trackEvent('greetings-dialog', 'show-form');

            $location.path('/');
        });
    }

    // New version
    if ($routeParams.event === 'update' && $routeParams.version !== undefined) {
        $mdToast.show({
            hideDelay: 0,
            position: 'top right',
            controller: 'ToastNewVersionController',
            templateUrl: '../html/toast_new_version.min.html',
            locals: {
                version: $routeParams.version
            }
        });
    }

}]);

app.controller('ToastNewVersionController', ['$scope', '$location', '$mdToast', 'version', function ($scope, $location, $mdToast, version) {
    $scope.version = version;

    $scope.closeToast = function () {
        $mdToast.hide().then(function () {
            $location.path('/');
        });
    };

    $scope.openGitHubReleases = function () {
        chrome.tabs.create({ url: 'https://github.com/sylouuu/chrome-open-tabs/releases' });

        $scope.closeToast();
    };
}]);
