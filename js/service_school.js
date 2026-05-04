(function() {
    const COUNTY = {
        "taipei": {
            "zh-TW": "臺北市",
            "en-US": "Taipei City"
        },
        "new_taipei": {
            "zh-TW": "新北市",
            "en-US": "New Taipei City"
        },
        "keelung": {
            "zh-TW": "基隆市",
            "en-US": "Keelung City"
        },
        "taoyuan": {
            "zh-TW": "桃園市",
            "en-US": "Taoyuan City"
        },
        "hsinchu_county": {
            "zh-TW": "新竹縣",
            "en-US": "Hsinchu County"
        },
        "hsinchu_city": {
            "zh-TW": "新竹市",
            "en-US": "Hsinchu City"
        },
        "miaoli": {
            "zh-TW": "苗栗縣",
            "en-US": "Miaoli County"
        },
        "taichung": {
            "zh-TW": "臺中市",
            "en-US": "Taichung City"
        },
        "changhwa": {
            "zh-TW": "彰化縣",
            "en-US": "Changhua County"
        },
        "nantou": {
            "zh-TW": "南投縣",
            "en-US": "Nantou County"
        },
        "yunlin": {
            "zh-TW": "雲林縣",
            "en-US": "Yunlin County"
        },
        "chiayi_county": {
            "zh-TW": "嘉義縣",
            "en-US": "Chiayi County"
        },
        "chiayi_city": {
            "zh-TW": "嘉義市",
            "en-US": "Chiayi City"
        },
        "tainan": {
            "zh-TW": "臺南市",
            "en-US": "Tainan City"
        },
        "kaohsiung": {
            "zh-TW": "高雄市",
            "en-US": "Kaohsiung City"
        },
        "pingtung": {
            "zh-TW": "屏東縣",
            "en-US": "Pingtung County"
        },
        "taitung": {
            "zh-TW": "臺東縣",
            "en-US": "Taitung County"
        },
        "hualien": {
            "zh-TW": "花蓮縣",
            "en-US": "Hualien County"
        },
        "yilan": {
            "zh-TW": "宜蘭縣",
            "en-US": "Yilan County"
        },
        "kinmen": {
            "zh-TW": "金門縣",
            "en-US": "Kinmen County"
        },
        "lienchiang": {
            "zh-TW": "連江縣",
            "en-US": "Lienchiang County"
        }
    }

    const SCHOOL_TYPE = {
        "elementary": {
            "zh-TW": "國小",
            "en-US": "Elementary School"
        },
        "junior": {
            "zh-TW": "國中",
            "en-US": "Junior High School"
        },
        "elem_junior": {
            "zh-TW": "國中小",
            "en-US": "Elementary and Junior High School"
        },
        "high": {
            "zh-TW": "高中",
            "en-US": "Senior High School"
        },
        "experiment": {
            "zh-TW": "實驗學校",
            "en-US": "Experimental School"
        }
    }

    class SchoolCard extends HTMLElement {
        static get observedAttributes() {
            return ["lang"]
        }

        connectedCallback() {
            this._render()
            this.addEventListener("click", () => this._onSelect())
        }

        attributeChangedCallback() {
            if (this.isConnected) this._render()
        }

        _render() {
            const lang = this.getAttribute('lang') || 'zh-TW';
            const county = this.getAttribute('data-county');
            const type = this.getAttribute('data-type');
            const name = this.getAttribute('data-name');
            const enName = this.getAttribute('data-en-name');
            const image = this.getAttribute('data-image') || 'img/icon-no-image.png';

            // 第一次渲染才建立 shadow root
            // if (!this.shadowRoot) {
            //     this.attachShadow({ mode: 'open' });
            // }

            this.innerHTML = `
                <div class="school-item-content button">
                    <img class="button-image" src="${image}">
                    <div class="button-content">
                        <h3>${name}<span class="sub-title">${enName}</span></h3>
                        <p class="button-description">${COUNTY[county][lang]} | ${SCHOOL_TYPE[type][lang]}</p>
                    </div>
                </div>
            `
        }

        _onSelect() {
            this.dispatchEvent(new CustomEvent('school-selected', {
                bubbles: true,
                composed: true,
                detail: {
                    name:    this.getAttribute('data-name'),
                    enName:  this.getAttribute('data-en-name'),
                    county:  this.getAttribute('data-county'),
                    type:    this.getAttribute('data-type'),
                    image:   this.getAttribute('data-image'),
                    introduction:   this.getAttribute('data-intro'),
                    site:    this.getAttribute('data-site'),
                    address: this.getAttribute('data-address'),
                }
            }))
        }
    }

    class SchoolDetail extends HTMLElement {
        connectedCallback() {
            // this.attachShadow({mode: "open"})
            this._renderEmpty()

            document.addEventListener('school-selected', (e) => {
                this._renderDetail(e.detail)
            })
        }

        _renderEmpty() {
            this.innerHTML = `
                <style>
                    :host { display: none; }
                </style>
            `
        }

        _renderDetail(school) {
            const lang = document.querySelector('#lang-toggle')?.dataset.lang || 'zh-TW';
            this.innerHTML = `
                <div class="school-detail">
                    <h2>${school.name}<p class="sub-title">${school.enName}</p></h2>
                    <p class="category">${COUNTY[school.county][lang]} | ${SCHOOL_TYPE[school.type][lang]}</p>
                    ${school.image ? `<img class="school-image" src="${school.image}" alt="${school.name}">` : ''}
                    <p class="markdown-content">${markdownToHTML(school.introduction)}</p>
                    <a class="site-link button" href="${school.site}" target="_blank" rel="noopener noreferrer">了解更多</a>
                    <a class="google-maps-link button" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address)}" target="_blank" rel="noopener noreferrer">在 Google 地圖中查看</a>
                </div>
            `
        }
    }

    customElements.define('school-card', SchoolCard)
    customElements.define('school-detail', SchoolDetail)

    fetch("./js/data.json", { cache: 'no-cache' }).then(response => response.json()).then(data => {
        const configLang = localStorage.getItem("language") || "zh-TW";
        const elementLangToggle = document.querySelector('#lang-toggle');

        const elementPageSchoolSelect = document.querySelector('.school .school-select')
        const elementPageSchoolIntroduction = document.querySelector('.school .school-introduction')

        const elementSchoolList = document.querySelector('.school .school-select .school-list')

        const elementSchoolIntroductionButtonBack = document.querySelectorAll('.school .school-introduction-button-back')

        //data to School List
        data.school.forEach(item => {
            const elementSchoolItem = document.createElement('school-card')
            elementSchoolItem.classList.add('school-item', item.county, item.type)
            elementSchoolItem.setAttribute('lang', configLang)
            elementSchoolItem.setAttribute('data-name', item.school_name)
            elementSchoolItem.setAttribute('data-en-name', item.school_en_name)
            elementSchoolItem.setAttribute('data-county', item.county)
            elementSchoolItem.setAttribute('data-type', item.type)
            elementSchoolItem.setAttribute('data-image', item.image || '')
            elementSchoolItem.setAttribute('data-intro', item.introduction || '')
            elementSchoolItem.setAttribute('data-site', item.site || '')
            elementSchoolItem.setAttribute('data-address', item.address || '')

            elementSchoolList.appendChild(elementSchoolItem)
        })

        const elementSelection = document.querySelectorAll('.school .school-select .selection a')

        elementLangToggle.addEventListener('change', (e) => {
            var lang = e.target.dataset.lang || "zh-TW"

            elementSelection.forEach(link => {
                if (link.classList.contains('county')) {
                    link.textContent = COUNTY[link.dataset.filter][lang]
                }
                if (link.classList.contains('school-type')) {
                    link.textContent = SCHOOL_TYPE[link.dataset.filter][lang]
                }
                if (link.classList.contains('all')) {
                    link.textContent = lang == "zh-TW" ? '顯示所有選項' : 'All'
                }
            })

            document.querySelectorAll('school-card').forEach(card => card.setAttribute('lang', lang || "zh-TW"))
        })

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                var isoSchoolList = new Isotope('.school .school-list' , {
                    itemSelector: '.school-item',
                })

                elementSelection.forEach(link => link.addEventListener('click', (e) => {
                    e.preventDefault()

                    isoSchoolList.arrange({
                        filter: function(item) {
                            var filterText = link.dataset.filter
                            if (filterText == "all") {
                                return true
                            }

                            return item.classList.contains(filterText)
                        }
                    })
                }))
            })
        })

        document.addEventListener('school-selected', (e) => {
            elementPageSchoolSelect.classList.add('display-none');
            elementPageSchoolIntroduction.classList.remove('display-none');
        });

        elementSchoolIntroductionButtonBack.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault()
                elementPageSchoolSelect.classList.remove('display-none');
                elementPageSchoolIntroduction.classList.add('display-none');
            })
        })
    }).finally(() => {
        window.__moduleReady = window.__moduleReady || {}
        window.__moduleReady['service-school'] = true
        document.dispatchEvent(new CustomEvent("module-ready", { detail: {module: "service-school"}}))
    })
})()