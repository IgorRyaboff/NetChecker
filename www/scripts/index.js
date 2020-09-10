var sysLang = navigator.language.substr(0, 2);
var phrases = {
    _get: (id, lang = sysLang) => {
        if (!phrases[id]) return 'Unknown phrase ' + id;
        if (phrases[id][lang] === undefined) {
            if (lang == 'en') return 'No lang available for phrase ' + id;
            else return phrases._get(id, 'en');
        }
        return phrases[id][lang];
    },
    refresh: {
        ru: 'Повторить проверку',
        en: 'Retry'
    },
    status_pending: {
        ru: 'Проверяем...',
        en: 'Checking...'
    },
    status_success: {
        ru: 'Есть соединение',
        en: 'Successful'
    },
    status_fail: {
        ru: 'Нет соединения',
        en: 'No connection'
    },
    appVersionPrefix: {
        ru: 'Версия',
        en: 'Version'
    }
};

function checkStatus(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('HEAD', url, true);

        request.onreadystatechange = () => {
            if (request.readyState >= 2) {
                resolve(request.status);
                request.abort();
            }
        }

        request.onerror = (e) => {
            reject(e);
        }

        request.send();
    })
}

let app = new Vue({
    el: '#app',
    data: {
        status: 'none',
        appVersion: '0.0.0'
    },
    computed: {
        formattedStatus: function () {
            return phrases._get('status_' + this.status);
        },
        statusColor: function () {
            let colors = {
                success: 'green',
                fail: 'red'
            };
            return colors[this.status] || 'black';
        },
        formattedRefreshText: function () {
            return phrases._get('refresh');
        },
        appVersionPrefix: function () {
            return phrases._get('appVersionPrefix');
        }
    },
    methods: {
        retry: function () {
            console.log('retry called');
            app.status = 'pending';
            checkStatus('https://google.com').then(status => {
                app.status = status == 200 ? 'success' : 'fail';
            }).catch(() => {
                app.status = 'fail';
            });
        },
        openGitHub: () => {
            cordova.InAppBrowser.open('https://github.com/IgorRyaboff/NetChecker', '_system');
        }
    }
});
app.retry();

document.addEventListener("deviceready", () => {
    cordova.getAppVersion.getVersionNumber(function (version) {
        app.appVersion = version;
    });
}, false);