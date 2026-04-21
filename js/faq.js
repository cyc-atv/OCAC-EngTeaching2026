(function(){
    class WeatherDataItem extends HTMLElement {
        connectedCallback() {
            const scriptTag = this.querySelector('script[type="application/json"]')

            if (!scriptTag?.textContent.trim()) return

            try {
                const slot = JSON.parse(scriptTag.textContent)

                this.innerHTML = `
                <style>
                    weather-data-item {
                        display: block;
                        flex: 1;
                    }
                </style>
                <div class="time-slot">
                    <p class="time-stamp"><span class="start-time">${slot.startTime}</span>~<span class="end-time">${slot.endTime}</span></p>
                    <ul class="weather-data-list">
                        <li class="weather-data-item Wx"><span class="data-title">天氣：</span><span class="data-shower">${slot.weather.Wx.parameterName}</span></li>
                        <li class="weather-data-item PoP"><span class="data-title">降雨機率：</span><span class="data-shower">${slot.weather.PoP.parameterName}&nbsp;%</span></li>
                        <li class="weather-data-item MinT"><span class="data-title">最低氣溫：</span><span class="data-shower">${slot.weather.MinT.parameterName}&nbsp;&#8451;</span></li>
                        <li class="weather-data-item MaxT"><span class="data-title">最高氣溫：</span><span class="data-shower">${slot.weather.MaxT.parameterName}&nbsp;&#8451;</span></li>
                        <li class="weather-data-item CI"><span class="data-title">舒適度：</span><span class="data-shower">${slot.weather.CI.parameterName}</span></li>
                    </ul>
                </div>
            `
            } catch (e) {
                console.error("Failed to parse weather data:", e)
                return
            }
        }
    }

    customElements.define('weather-data-item', WeatherDataItem)

    const elementFaqIndexLink = document.querySelectorAll('.page-content .faq .index li a')
    const elementFaqContent = document.querySelectorAll('.page-content .faq .content')

    elementFaqIndexLink.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault()

            var target = e.currentTarget.getAttribute('href').replace('#', '')
            elementFaqContent.forEach((content) => {
                if (content.classList.contains(target)) {
                    content.classList.remove('display-none')
                } else {
                    content.classList.add('display-none')
                }
            })
        })
    })

    const elementWeatherPage = document.querySelector('.page-content .faq .content.weather .weather-data-table')
    const dateConvert = (date) => {
        const yyyy = date.getFullYear()
        const MM = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始所以+1
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');

        return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
    }
    const dateStringFrom = dateConvert(new Date(Date.now()))
    const dateStringTo = dateConvert((() => {
        var date = new Date(Date.now())
        date.setDate(date.getDate() + 1)
        return date
    })())
    fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-495E346B-BDF3-4E17-BE80-3A98E93B7B11&format=JSON&locationName=%E8%87%BA%E5%8C%97%E5%B8%82,%E6%96%B0%E5%8C%97%E5%B8%82,%E6%A1%83%E5%9C%92%E5%B8%82,%E8%87%BA%E4%B8%AD%E5%B8%82,%E8%87%BA%E5%8D%97%E5%B8%82,%E9%AB%98%E9%9B%84%E5%B8%82,%E6%96%B0%E7%AB%B9%E7%B8%A3,%E6%96%B0%E7%AB%B9%E5%B8%82,%E8%8B%97%E6%A0%97%E7%B8%A3,%E5%BD%B0%E5%8C%96%E7%B8%A3,%E5%8D%97%E6%8A%95%E7%B8%A3,%E9%9B%B2%E6%9E%97%E7%B8%A3,%E5%98%89%E7%BE%A9%E7%B8%A3,%E5%98%89%E7%BE%A9%E5%B8%82,%E5%B1%8F%E6%9D%B1%E7%B8%A3&timeFrom=${dateStringFrom}&timeTo=${dateStringTo}`, { cache: 'no-cache' }).then(response => response.json()).then((weatherData) => {
        if (weatherData.success != "true") {
            throw new Error("Can't get weather data.")
        }

        var content = weatherData.records.location.map((location) => {
            const timeMap = {}

            location.weatherElement.forEach(element => {
                element.time.forEach(timeSlot => {
                    const key = `${timeSlot.startTime}_${timeSlot.endTime}`

                    if (!timeMap[key]) {
                        timeMap[key] = {
                            startTime: timeSlot.startTime,
                            endTime: timeSlot.endTime,
                            weather: {}
                        }
                    }

                    timeMap[key].weather[element.elementName] = timeSlot.parameter
                })
            })

            const timeSlots = Object.values(timeMap).sort(
                (a, b) => new Date(a.startTime) - new Date(b.startTime)
            )

            return `<div class="location">
                <h3 class="location-name">${location.locationName}</h3>
                <div class="location-weather">
                ${timeSlots.map(slot => {
                    return `<weather-data-item>
                        <script type="application/json">
                            ${JSON.stringify(slot)}
                        </script>
                    </weather-data-item>`
                }).join('')}
                </div>
            </div>`
        }).join('')

        elementWeatherPage.innerHTML = content
    }).catch((e) => {
        console.log(e)
        elementWeatherPage.innerHTML = `
            <p class="error-message">
                <span>非常抱歉，目前無法提供天氣資料。</span><br>
                <span>We are sorry for the inconvenience.</span>
            </p>`
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("module-ready", { detail: {module: "weather"}}))
    })
})()