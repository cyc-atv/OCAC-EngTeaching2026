(function() {
    var translation_data = [];
    const elementLangToggle = document.querySelector('#lang-toggle');
    
    fetch('./js/translation.json').then(response => response.json()).then(data => {
        const configLang = localStorage.getItem("language") || "zh-TW";
        translation_data = data;

        elementLangToggle.addEventListener('change', () => {
            if (elementLangToggle.checked) {
                elementLangToggle.dataset.lang = 'en-US';
            } else {
                elementLangToggle.dataset.lang = 'zh-TW';
            }

            toggleLanguage(elementLangToggle.dataset.lang);
        });

        elementLangToggle.dataset.lang = configLang;
        elementLangToggle.checked = configLang === 'en-US';

        toggleLanguage(configLang);
    }).then(() => {
        document.dispatchEvent(new CustomEvent("module-ready", { detail: {module: "main"}}))
    });

    function toggleLanguage(lang) {
        //Change Language
        translation_data.forEach(item => {
            const element = document.querySelector(item.id)
            if (element) {
                if (element instanceof HTMLAnchorElement && item.attribute == "href") {
                    element.setAttribute("href", item[lang]);
                } else if (item.isHTMLContent) {
                    element.innerHTML = item[lang]
                } else {
                    element.textContent = item[lang];
                }
            }
        })

        localStorage.setItem("language", lang);
    }
})()