(function() {
    const elementPageNavButtons = document.querySelectorAll('.page-nav .button')
    const elementPageBackButton = document.querySelectorAll('.button.to-top')
    
    elementPageNavButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault()

            const elementTargeSection = document.querySelector(`article.${button.getAttribute('href').split('#').filter(Boolean).pop()}`)

            if (elementTargeSection) {
                // window.scrollTo({
                //     top: elementTargeSection.offsetTop - ,
                //     behavior: 'smooth'
                // })
                elementTargeSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
        })
    })

    elementPageBackButton.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault()
            window.scrollTo({top: 0, behavior: 'smooth'})
        })
    })
})()