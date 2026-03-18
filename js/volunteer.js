(function() {
    const configLang = localStorage.getItem("language") || "zh-TW";
    const countdownDate = new Date("2026/5/29 23:59:59:999")
    const elementCountdownDigitTitle = document.querySelector('.countdown .digit .title')
    const elementCountdownDigitData = document.querySelector('.countdown .digit .data')
    const elementCountdownDigits = document.querySelectorAll('.countdown .digit .data .digit')

    const setCountdownDigit = (days, hours, minutes, seconds, timerID) => {
        if (days <= 0) {
            elementCountdownDigitTitle.classList.add('countdown-end')
            elementCountdownDigitTitle.textContent = configLang == "zh-TW" ? "志工報名已結束" : "The Volunteer Registration Period is over."
            elementCountdownDigitData.classList.add('display-none')
            elementCountdownDigits.forEach(item => item.textContent = '')
            clearInterval(timerID)
            return
        }
        
        [days, hours, minutes, seconds].map((value, index) => elementCountdownDigits[index].textContent = value)
    }

    const timer = setInterval(function() {
        var now = new Date(Date.now()).getTime()

        var distance = countdownDate - now

        var days = Math.floor(distance / (1000 * 60 * 60 * 24))
        var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
        var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60))
        var seconds = Math.floor(distance % (1000 * 60) / 1000)

        setCountdownDigit(days, hours, minutes, seconds, timer)
    }, 1000)
})()