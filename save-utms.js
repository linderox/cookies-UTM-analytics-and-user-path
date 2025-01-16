<script>
// Функция для установки cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Функция для получения cookies
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Функция для обработки и сохранения UTM и visit_path
function saveUTMAndVisitPath() {
    var query = window.location.search.substring(1);
    var params = query.split('&');
    var utmParams = {};
    var userJourney = getCookie('user_journey') || "";
    var referrer = document.referrer ? new URL(document.referrer).hostname : "ИсточникНеопределен";
    var currentDomain = window.location.hostname;
    var visitPathJSON = getCookie('visit_path_json') ? JSON.parse(getCookie('visit_path_json')) : {};
    var lastTimestamp = getCookie('last_timestamp') ? parseInt(getCookie('last_timestamp'), 10) : 0;
    var now = Date.now();

    // Если прошло более 2 часов, создаем новый визит
    if (now - lastTimestamp > 2 * 60 * 60 * 1000) {
        setCookie('last_timestamp', now.toString(), 30);
        visitPathJSON["Visit " + (Object.keys(visitPathJSON).length + 1)] = {};
    }

    // Добавляем текущую страницу в текущий визит
    var currentVisitKey = "Visit " + Object.keys(visitPathJSON).length;
    var visitPages = visitPathJSON[currentVisitKey] || {};
    var currentPath = window.location.pathname + window.location.hash;
    if (!Object.values(visitPages).includes(currentPath)) {
        visitPages[Object.keys(visitPages).length + 1] = currentPath;
    }
    visitPathJSON[currentVisitKey] = visitPages;

    // Разбираем UTM-параметры
    for (var i = 0; i < params.length; i++) {
        var pair = params[i].split('=');
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1] || "");

        if (key.indexOf('utm_') === 0) {
            utmParams[key] = value;
            setCookie(key, value, 30); // Сохраняем каждый UTM-параметр в cookies
        }
    }

    // Если реферер внешний, добавляем его в user_journey
    if (referrer !== "ИсточникНеопределен" && referrer !== currentDomain) {
        var utmSource = utmParams['utm_source'] || "ИсточникНеопределен";
        var utmCampaign = utmParams['utm_campaign'] || "КампанияНеопределена";
        userJourney += referrer + " | " + utmSource + " | " + utmCampaign + " -> ";
    }

    // Сохраняем user_journey
    setCookie('user_journey', userJourney, 30);

    // Сохраняем visit_path_json
    setCookie('visit_path_json', JSON.stringify(visitPathJSON), 30);

    // Создаем строку для логирования visit_path
    var visitPathString = "";
    for (var visit in visitPathJSON) {
        visitPathString += visit + ": ";
        var pages = visitPathJSON[visit];
        for (var pageKey in pages) {
            visitPathString += pages[pageKey] + " -> ";
        }
        visitPathString = visitPathString.slice(0, -4) + "\n"; // Убираем последний -> и добавляем перенос строки
    }

    setCookie('visit_path', visitPathString, 30);

    console.log('UTM параметры сохранены:', utmParams);
    console.log('User Journey обновлен:', userJourney);
    console.log('Visit Path JSON:', visitPathJSON);
    console.log('Visit Path строка:', visitPathString);
}

// Перехват изменений URL
function handleURLChange() {
    saveUTMAndVisitPath();
}

// Выполнение при загрузке страницы
saveUTMAndVisitPath();

// Обработчики для изменений URL
window.addEventListener('hashchange', handleURLChange);
window.addEventListener('popstate', handleURLChange);


</script>
