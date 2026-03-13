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

    fetch("./js/data.json").then(response => response.json()).then(data => {
        const configLang = localStorage.getItem("language") || "zh-TW";
        const elementLangToggle = document.querySelector('#lang-toggle');

        const elementPageSchoolSelect = document.querySelector('.school .school-select')
        const elementPageSchoolIntroduction = document.querySelector('.school .school-introduction')

        const elementSelection = document.querySelectorAll('.school .school-select .selection a')
        const elementSchoolList = document.querySelector('.school .school-select .school-list')

        const elementSchoolIntroductionArticleContent = document.querySelector('.school .school-introduction .article-content')
        const elementSchoolIntroductionButtonBack = document.querySelectorAll('.school .school-introduction-button-back')

        //data to School List
        data.school.forEach(item => {
            const elementSchoolItem = document.createElement('div')
            elementSchoolItem.classList.add('school-item', item.county, item.type)
            elementSchoolItem.setAttribute('data-school-name', item.school_name)
            elementSchoolItem.setAttribute('data-school-county', item.county)
            elementSchoolItem.setAttribute('data-school-type', item.type)
            elementSchoolItem.innerHTML = `<div class="school-item-content button"><h3>${item.school_name}<span class="sub-title">${item.school_en_name}</span></h3>
                <p>${COUNTY[item.county][configLang]} | ${SCHOOL_TYPE[item.type][configLang]}</p></div>`

            elementSchoolItem.addEventListener('click', (e) => {
                var elementItem = e.currentTarget
                // Generate School Detail Page
                var schoolItem = data.school.filter(school => school.school_name == elementItem.dataset.schoolName && school.county == elementItem.dataset.schoolCounty && school.type == elementItem.dataset.schoolType)[0]
                
                elementSchoolIntroductionArticleContent.dataset.schoolName = schoolItem.school_name
                elementSchoolIntroductionArticleContent.dataset.county = schoolItem.county
                elementSchoolIntroductionArticleContent.dataset.type = schoolItem.type
                elementSchoolIntroductionArticleContent.innerHTML = `
                    <h2>${schoolItem.school_name}</h2>
                    <p>${COUNTY[schoolItem.county][configLang]} | ${SCHOOL_TYPE[schoolItem.type][configLang]}</p>
                    <p>${markdownToHTML(schoolItem.introduction)}</p>
                    <a class="site-link" href="${schoolItem.site}" target="_blank" rel="noopener noreferrer">了解更多</a>
                    <a class="google-maps-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolItem.address)}" target="_blank" rel="noopener noreferrer">在 Google 地圖中查看</a>
                `

                elementPageSchoolSelect.style.display = 'none'
                elementPageSchoolIntroduction.style.display = 'block'
            })
            elementSchoolList.appendChild(elementSchoolItem)
        })

        var isoSchoolList = new Isotope('.school .school-list' , {
            itemSelector: '.school-item',
        })

        elementLangToggle.addEventListener('change', () => {
            elementSelection.forEach(link => {
                if (link.classList.contains('county')) {
                    link.textContent = COUNTY[link.dataset.filter][elementLangToggle.dataset.lang]
                }
                if (link.classList.contains('school-type')) {
                    link.textContent = SCHOOL_TYPE[link.dataset.filter][elementLangToggle.dataset.lang]
                }
                if (link.classList.contains('all')) {
                    link.textContent = elementLangToggle.dataset.lang == "zh-TW" ? '顯示所有選項' : 'All'
                }
            })
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

        elementSchoolIntroductionButtonBack.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault()
                elementPageSchoolSelect.style.display = 'block'
                elementPageSchoolIntroduction.style.display = 'none'
            })
        })
    })
})()