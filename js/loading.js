(function () {
    const overlay = document.querySelector('.loading-overlay')
    // const moduleNames = (overlay.dataset.waitFor || '').split(' ').filter(Boolean).map(name => ({
    //     module: name.trim(),
    //     loadingStatus: false
    // }))
    const moduleNames = (overlay.dataset.waitFor || '').split(' ').filter(Boolean).map(name => name.trim())

    var showPage = () => {
        overlay.style.opacity = 0
        setTimeout(() => {
            overlay.style.display = 'none'
        }, 1000)
    }

    if (moduleNames.length === 0) {
        showPage()
    }

    window.__moduleReady = window.__moduleReady || {}

    const readyModules = new Set(Object.keys(window.__moduleReady))

    const checkAllReady = () => {
        if (moduleNames.every(name => readyModules.has(name))) {
            showPage()
        }
    }
    checkAllReady()

    document.addEventListener('module-ready', (e) => {
        // const target = moduleName.find(m => m.module === e.detail.module)
        // if (target) {
        //     target.loadingStatus = true
        // }

        // if (moduleName.every(m => m.loadingStatus)) {
        //     showPage()
        // }
        readyModules.add(e.detail.module)
        checkAllReady()
    })
})()