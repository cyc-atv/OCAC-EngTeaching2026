(function() {
    const countdownDate = new Date("2026/5/29 23:59:59:999")
    const elementCountdownDigit = document.querySelector('.countdown .digit')

    const setCountdownDigit = (days, hours, minutes, seconds) => {
        if (days <= 0) {
            elementCountdownDigit.innerHTML = `<p><span class="title countdown-end">志工報名已結束</span></p>`
            return
        }

        elementCountdownDigit.innerHTML = `<p><span class="title">志工報名結束倒數：</span>${days}<span class="day">日</span>${hours}<span class="hour">時</span>${minutes}<span class="minute">分</span>${seconds}<span class="second">秒</span></p>`
    }

    const timer = setInterval(function() {
        var now = new Date(Date.now()).getTime()

        var distance = countdownDate - now

        var days = Math.floor(distance / (1000 * 60 * 60 * 24))
        var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
        var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60))
        var seconds = Math.floor(distance % (1000 * 60) / 1000)

        setCountdownDigit(days, hours, minutes, seconds)
    }, 1000)
})()