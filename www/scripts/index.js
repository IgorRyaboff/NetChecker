var sysLang = navigator.language.substr(0, 2);
var phrases = {
    _get: (id, lang = sysLang) => {
        if (phrases[id][lang] === undefined) {
            if (lang == 'en') return 'Unknown phrase ' + id;
            else return phrases._get(id, 'en');
        }
        return phrases[id][lang];
    },
    refresh: {
        ru: 'Повторить проверку',
        en: 'Check again'
    },
    checking: {
        ru: 'Проверяем...',
        en: 'Checking...'
    },
    connection_success: {
        ru: 'Есть соединение',
        en: 'Successful'
    },
    connection_failed: {
        ru: 'Нет соединения',
        en: 'No connection'
    }
};
$('#refreshText').text(phrases._get('refresh'));
$('#startChecking').click(() => {
    $('#checkResult').text(phrases._get('checking'));
    $('#checkResult').attr("style", "color: black");
    jQuery.ajax({
        url: 'https://google.com',
        success: (data, textStatus, jqXHR) => {
            if (data == "") {
                $('#checkResult').text(phrases._get('connection_failes'));
                $('#checkResult').attr("style", "color: red");
            }
            else {
                $('#checkResult').text(phrases._get('connection_success'));
                $('#checkResult').attr("style", "color: green");
            }
        },
        error: () => {
            $('#checkResult').text(phrases._get('connection_failed'));
            $('#checkResult').attr("style", "color: red");
        }
    });
});

$('#startChecking').click();
