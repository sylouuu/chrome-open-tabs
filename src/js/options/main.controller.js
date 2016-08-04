app.controller('MainController', ['$scope', '$mdDialog', '$mdMedia', 'Analytics', function ($scope, $mdDialog, $mdMedia, Analytics) {

    $scope.open_tabs = {
        settings: {
            enable_new_version_notification: false,
            show_browser_action_count: true
        },
        hidden_tabs: []
    };
    $scope.search    = { query: null };
    $scope.tabs      = {
        pinned: { code: 'PINNED_TABS', title: 'Pinned tabs', data: [], selected: [] },
        standard: { code: 'STANDARD_TABS', title: 'Standard tabs', data: [], selected: [] },
        hidden: { code: 'HIDDEN_TABS', title: 'Hidden tabs', data: [], selected: [] }
    };

    chrome.storage.local.get('open_tabs', function (items) {
        if (items.open_tabs !== undefined) {
            $scope.open_tabs = items.open_tabs;

            $scope.tabs.hidden.data = (items.open_tabs.hidden_tabs === undefined) ? [] : items.open_tabs.hidden_tabs;
        }

        $scope.$apply();
    });

    $scope.saveSettings = function (open_tabs) {
        chrome.storage.local.set({ open_tabs: open_tabs });

        chrome.extension.getBackgroundPage().handleBrowserActionBadgeEvents();
    };

    $scope.loadTabs = function () {
        chrome.tabs.query({}, function (tabs) {
            $scope.tabs.pinned.data   = [];
            $scope.tabs.standard.data = [];

            for (var i = 0; i < tabs.length; i++) {
                // Exclude options page
                if (tabs[i].url !== chrome.extension.getURL('html/options.html')) {
                    if (tabs[i].pinned === true) {
                        $scope.tabs.pinned.data.push(tabs[i]);
                    } else {
                        $scope.tabs.standard.data.push(tabs[i]);
                    }
                }
            }

            $scope.$apply();
        });
    };

    $scope.loadTabs();

    $scope.showSettings = function (evt) {
        $mdDialog.show({
            controller: 'SettingsModalController',
            templateUrl: '../html/settings_modal.html',
            targetEvent: evt,
            clickOutsideToClose: false,
            fullscreen: $mdMedia('xs'),
            resolve: {
                open_tabs: function () {
                    return $scope.open_tabs;
                }
            }
        }).then(function (data) {
            $scope.saveSettings(data);

            Analytics.trackEvent('settings', 'save');
        });
    };

    // ---------------------------------------------------------------------------------
    // Listeners

    chrome.tabs.onCreated.addListener(function () {
        $scope.loadTabs();
    });

    chrome.tabs.onUpdated.addListener(function () {
        $scope.loadTabs();
    });

    chrome.tabs.onRemoved.addListener(function () {
        $scope.loadTabs();
    });

    chrome.tabs.onReplaced.addListener(function () {
        $scope.loadTabs();
    });

    chrome.tabs.onMoved.addListener(function () {
        $scope.loadTabs();
    });

    chrome.tabs.onDetached.addListener(function () {
        $scope.loadTabs();
    });

    chrome.tabs.onAttached.addListener(function () {
        $scope.loadTabs();
    });

    chrome.tabs.onActivated.addListener(function () {
        $scope.loadTabs();
    });

}]);

app.controller('SettingsModalController', ['$scope', '$mdDialog', 'open_tabs', function ($scope, $mdDialog, open_tabs) {

    $scope.open_tabs = open_tabs;

    $scope.closeForm = function () {
        $mdDialog.cancel();
    };

    $scope.save = function (data) {
        $mdDialog.hide(data);
    };

}]);
