(function () {
    const overlay = document.querySelector('.loading-overlay')
    const moduleNames = (overlay.dataset.waitFor || '').split(' ').filter(Boolean).map(name => name.trim())

    var _isHidden = false
    var showPage = () => {
        if (_isHidden) return   // 防止重複觸發
        _isHidden = true
        overlay.style.opacity = 0
        setTimeout(() => {
            overlay.style.display = 'none'
        }, 1000)
    }

    if (moduleNames.length === 0) {
        showPage()
        return
    }

    window.__moduleReady = window.__moduleReady || {}

    const checkAllReady = () => {
        if (moduleNames.every(name => window.__moduleReady[name])) {
            showPage()
        }
    }

    // 立即檢查一次（處理模組比 overlay 腳本更早完成的情況）
    checkAllReady()

    // 監聽後續的 module-ready 事件
    document.addEventListener('module-ready', () => {
        checkAllReady()
    })

    // 保底：最多等 8 秒強制關閉
    setTimeout(showPage, 8000)
})()