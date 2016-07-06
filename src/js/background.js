var options_url = chrome.extension.getURL('html/options.min.html'), openOptionsPage, getOpenTabsCount, getStorage, updateBrowserActionBadge, handleBrowserActionBadgeEvents;

// --------------------------------------------------------------------------------------------------------
// Functions

openOptionsPage = function (hash) {
    chrome.tabs.query({ url: options_url }, function (tabs) {
        if (tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, { active: true, highlighted: true });
        } else {
            chrome.tabs.create({ url: (hash !== undefined) ? options_url + '#' + hash : options_url });
        }
    });
};

getOpenTabsCount = function (callback) {
    var count = 0;

    chrome.tabs.query({ url: options_url }, function (tabs) {
        count -= tabs.length;

        chrome.tabs.query({}, function (tabs) {
            count += tabs.length;

            callback(count);
        });
    });
};

getStorage = function (callback) {
    chrome.storage.local.get('open_tabs', function (items) {
        callback(items.open_tabs);
    });
};

chrome.browserAction.setBadgeBackgroundColor({ color: '#1E88E5' });

updateBrowserActionBadge = function (open_tabs) {
    if (open_tabs === undefined || open_tabs.settings.show_browser_action_count === true) {
        getOpenTabsCount(function (count) {
            chrome.browserAction.setBadgeText({ text: count.toString() });
        });
    } else {
        chrome.browserAction.setBadgeText({ text: '' });
    }
};

handleBrowserActionBadgeEvents = function () {
    var tab_listener = function () {
        getStorage(function (open_tabs) {
            return updateBrowserActionBadge(open_tabs);
        });
    };

    getStorage(function (open_tabs) {
        if (open_tabs === undefined || open_tabs.settings.show_browser_action_count === true) {
            chrome.tabs.onCreated.addListener(tab_listener);
            chrome.tabs.onRemoved.addListener(tab_listener);
        } else {
            chrome.tabs.onCreated.removeListener(tab_listener);
            chrome.tabs.onRemoved.removeListener(tab_listener);
        }

        updateBrowserActionBadge(open_tabs);
    });
};

// --------------------------------------------------------------------------------------------------------
// Events

chrome.browserAction.onClicked.addListener(function () {
    openOptionsPage();
});

handleBrowserActionBadgeEvents();

chrome.runtime.onInstalled.addListener(function (details) {
    switch (details.reason) {
        case 'install':
            openOptionsPage('install');
            break;
        case 'update':
            getStorage(function (open_tabs) {
                if (open_tabs === undefined || open_tabs.settings === undefined) {
                    return;
                }

                if (open_tabs.settings !== undefined && open_tabs.settings.enable_new_version_notification === true && details.previousVersion !== chrome.runtime.getManifest().version) {
                    openOptionsPage('update/' + chrome.runtime.getManifest().version);
                }
            });
            break;
    }
});
