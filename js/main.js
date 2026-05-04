(function() {
    var translation_data = [];
    const elementLangToggle = document.querySelector('#lang-toggle');
    const translationDataFileNameCommon = 'COMMON'
    
    fetch('./js/translation.json', { cache: 'no-cache' }).then(response => response.json()).then(data => {
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
    }).finally(() => {
        window.__moduleReady = window.__moduleReady || {}
        window.__moduleReady['main'] = true
        document.dispatchEvent(new CustomEvent("module-ready", { detail: {module: "main"}}));
    });

    function getCurrentHtmlFileName() {
        const path = window.location.pathname;
        const last = path.split('/').filter(Boolean).at(-1);

        if (!last) return 'index.html';
        if (last.endsWith('.html')) return last;

        return 'index.html';
    }

    function toggleLanguage(lang) {
        document.documentElement.lang = lang

        //Change Language
        translation_data.forEach(item => {
            if (!item.id || item.id == '') return;

            if (item.isPageTitle) {
                const currentPageFileName = location.pathname.split('/').pop() || 'index.html'
                if (item.id === currentPageFileName) {
                    document.title = item[lang];
                }
                return;
            }

            try {
                if (item.fileName && (getCurrentHtmlFileName() != item.fileName && item.fileName != translationDataFileNameCommon)) {
                    return
                }

                const elements = document.querySelectorAll(item.id)
                elements.forEach((element) => {
                    if (element) {
                        if (element instanceof HTMLAnchorElement && item.attribute == "href") {
                            element.setAttribute("href", item[lang]);
                        } else if (element instanceof HTMLImageElement && item.attribute == "src") {
                            element.setAttribute("src", item[lang]);
                        } else if (item.isHTMLContent) {
                            element.innerHTML = item[lang];
                        } else if (element.classList.contains('markdown-content')) {
                            element.innerHTML = markdownToHTML(item[lang]);
                        } else if (item.attribute != '') {
                            element.setAttribute(item.attribute, item[lang]);
                        } else {
                            element.textContent = item[lang];
                        }
                    }
                })
            } catch (e) {
                // console.warn(`翻譯模組: 無效的選擇器 ${item.id}`)
            }
        })

        localStorage.setItem("language", lang);
    }

    const navBarHeight = document.querySelector('.main-nav').offsetHeight

    document.querySelectorAll('.main-nav .menu-list a').forEach((menuButton) => {
        menuButton.addEventListener('click', (e) => {
            var arrRoute = menuButton.getAttribute('href').split('#')

            if ((document.location.pathname.split('/').pop() || 'index.html') === arrRoute[0]) {
                e.preventDefault()

                var target = document.querySelector(`a[name=${arrRoute[1]}]`) || document.querySelector(`.${arrRoute[1]}`)
                window.scrollTo({
                    top: target.offsetTop - navBarHeight,
                    behavior: "smooth"
                })
            }
        })
    })
})()