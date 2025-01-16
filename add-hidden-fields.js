<script>
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
  
// Форматируем visitPathJSON
function formatUserPath(visitPathJSON) {
    // Parse JSON if it is a string
    if (typeof visitPathJSON === 'string') {
        try {
            visitPathJSON = JSON.parse(visitPathJSON);
        } catch (e) {
            console.error('Ошибка парсинга visitPathJSON:', e);
            return 'Invalid visitPathJSON формат';
        }
    }

    var formattedPath = '';

    // Iterate through visits
    for (var visit in visitPathJSON) {
        formattedPath += visit + ':\n'; // Example: "Visit 1:"
        var pages = visitPathJSON[visit];
        var pageArray = [];
        
        // Collect page values into an array
        for (var key in pages) {
            if (pages.hasOwnProperty(key)) {
                pageArray.push(pages[key]);
            }
        }

        // Join pages with arrows
        formattedPath += pageArray.join(' -> ') + '\n\n'; // Separate visits with a blank line
    }

    return formattedPath.trim(); // Remove trailing whitespace
}


// Функция для добавления скрытых полей в формы
function addHiddenFieldsToForms() {
    var forms = document.getElementsByTagName('form');
    var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var utmValues = {};
    var userJourney = getCookie('user_journey') || "";
    var visitPath = getCookie('visit_path') ? JSON.parse(getCookie('visit_path')).join(' -> ') : "";
    var visitPathJSON = getCookie('visit_path_json') ? getCookie('visit_path_json') : "{}";

    // Получаем UTM-параметры из cookies
    for (var i = 0; i < utmKeys.length; i++) {
        var value = getCookie(utmKeys[i]);
        if (value) {
            utmValues[utmKeys[i]] = value;
        }
    }

    // Логирование исходных данных
    console.log('UTM параметры из cookies:', utmValues);
    console.log('User Journey:', userJourney);
    console.log('Visit Path:', visitPath);
    console.log('Visit Path JSON:', visitPathJSON);

    if (!forms.length) {
        console.warn('На странице не найдено ни одной формы.');
        return;
    }

    // Добавляем скрытые поля в каждую форму
    for (var j = 0; j < forms.length; j++) {
        console.log('Обрабатываем форму:', forms[j]);

        // Добавляем UTM-параметры
        for (var key in utmValues) {
            if (!forms[j].querySelector('input[name="' + key + '"]')) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = utmValues[key];
                forms[j].appendChild(input);
                console.log('Добавлено скрытое поле:', key, '=', utmValues[key]);
            }
        }

        // Добавляем user_journey
        if (userJourney && !forms[j].querySelector('input[name="user_journey"]')) {
            var journeyInput = document.createElement('input');
            journeyInput.type = 'hidden';
            journeyInput.name = 'История визитов';
            journeyInput.value = userJourney;
            forms[j].appendChild(journeyInput);
            console.log('Добавлено скрытое поле: user_journey =', userJourney);
        }

        // Добавляем visit_path
        if (visitPath && !forms[j].querySelector('input[name="visit_path"]')) {
            var pathInput = document.createElement('input');
            pathInput.type = 'hidden';
            pathInput.name = 'visit_path';
            pathInput.value = visitPath;
            forms[j].appendChild(pathInput);
            console.log('Добавлено скрытое поле: visit_path =', visitPath);
        }
      
        // Добавляем visit_path_json
        if (visitPathJSON && !forms[j].querySelector('input[name="visit_path_json"]')) {
            var jsonInput = document.createElement('input');
            jsonInput.type = 'hidden';
            jsonInput.name = 'Путь по сайту';
            jsonInput.value = formatUserPath(visitPathJSON);
            forms[j].appendChild(jsonInput);
            console.log('Добавлено скрытое поле: visit_path_json =', formatUserPath(visitPathJSON));
        }
    }

    console.log('Скрытые поля успешно добавлены во все формы.');
}

// Выполнение кода
addHiddenFieldsToForms();


</script>
