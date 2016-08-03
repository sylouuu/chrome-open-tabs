app.controller('HomeController', ['$scope', '$routeParams', '$location', '$mdDialog', '$mdToast', 'Analytics', function ($scope, $routeParams, $location, $mdDialog, $mdToast, Analytics) {

    $scope.syncHiddenTabs = function () {
        $scope.open_tabs.hidden_tabs = $scope.tabs.hidden.data;

        chrome.storage.local.set({ open_tabs: $scope.open_tabs });
    };

    // ---------------------------------------------------------------------------------
    // Checkboxes handling

    $scope.isIndeterminate = function (array) {
        return (array.selected.length !== 0 && array.selected.length !== array.data.length);
    };

    $scope.isChecked = function (array) {
        return array.selected.length === array.data.length;
    };

    $scope.toggleAll = function (array) {
        if (array.selected.length === array.data.length) {
            array.selected = [];
        } else if (array.selected.length === 0 || array.selected.length > 0) {
            angular.forEach(array.data, function (tab) {
                array.selected.push(tab.id);
            });
        }
    };

    $scope.toggle = function (array, tab_id) {
        var i = array.selected.indexOf(tab_id);

        if (i > -1) {
            array.selected.splice(i, 1);
        } else {
            array.selected.push(tab_id);
        }
    };

    // ---------------------------------------------------------------------------------
    // Actions on checked tabs

    $scope.closeAllTabs = function (array) {
        chrome.tabs.remove(array.selected);

        array.selected = [];
    };

    $scope.reloadAllTabs = function (array) {
        angular.forEach(array.selected, function (id) {
            $scope.reloadTab(id)
        });

        array.selected = [];
    };

    $scope.pinOrUnpinAllTabs = function (array, pinned) {
        angular.forEach(array.selected, function (id) {
            $scope.pinOrUnpinTab(id, pinned);
        });

        array.selected = [];
    };

    $scope.hideAllTabs = function (array) {
        angular.forEach(array.selected, function (id) {
            chrome.tabs.get(id, function (tab) {
                $scope.hideTab(tab);
            });
        });

        array.selected = [];
    };

    $scope.removeAllHiddenTabs = function (array) {
        // Loop in reverse because of splice
        for (var i = array.data.length - 1; i >= 0; i--) {
            if (array.selected.indexOf(array.data[i].id) !== -1) {
                array.data.splice(array.data.indexOf(array.data[i]), 1);
            }
        }

        array.selected = [];

        $scope.syncHiddenTabs();
    };

    // ---------------------------------------------------------------------------------
    // Actions on individual tab

    $scope.goToTab = function (tab) {
        chrome.tabs.update(tab.id, { active: true, highlighted: true });
    };

    $scope.removeTab = function (tab) {
        chrome.tabs.remove(tab.id);
    };

    $scope.reloadTab = function (id) {
        chrome.tabs.reload(id);
    };

    $scope.duplicateTab = function (tab) {
        chrome.tabs.create({ url: tab.url, active: false, pinned: tab.pinned, index: tab.index + 1 });
    };

    $scope.pinOrUnpinTab = function (id, pinned) {
        chrome.tabs.update(id, { pinned: pinned });
    };

    $scope.hideTab = function (tab) {
        $scope.tabs.hidden.data.push(tab);
        $scope.removeTab(tab);
        $scope.syncHiddenTabs();
    };

    $scope.removeHiddenTab = function (tab) {
        $scope.tabs.hidden.data.splice($scope.tabs.hidden.data.indexOf(tab), 1);
        $scope.syncHiddenTabs();
    };

    $scope.openHiddenTab = function (tab) {
        chrome.tabs.create({ url: tab.url, active: true });

        $scope.removeHiddenTab(tab);
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
