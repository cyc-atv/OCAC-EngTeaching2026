(function () {
    const overlay = document.querySelector('.loading-overlay')
    const moduleName = (overlay.dataset.waitFor || '').split(' ').filter(Boolean).map(name => ({
        module: name.trim(),
        loadingStatus: false
    }))

    var showPage = () => {
        overlay.style.opacity = 0
        setTimeout(() => {
            overlay.style.display = 'none'
        }, 1000)
    }

    if (moduleName.length === 0) {
        showPage()
    }

    document.addEventListener('module-ready', (e) => {
        const target = moduleName.find(m => m.module === e.detail.module)
        if (target) {
            target.loadingStatus = true
        }

        if (moduleName.every(m => m.loadingStatus)) {
            showPage()
        }
    })
})()