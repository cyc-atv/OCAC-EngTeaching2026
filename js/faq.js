(function(){
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
})()