(function() {
    class TravelCard extends HTMLElement {
        static _template = (() => {
            const template = document.createElement('template')
            template.innerHTML = `
                <style>
                @import('css/style.css');

                .travel-card {
                    width: 100%;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 1em;
                    display: flex;
                    flex-direction: column;
                }

                .travel-card-header {
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5em;
                }

                .travel-card-header .travel-date {
                    font-size: 1.25em;
                    margin: 0;
                }

                .travel-card-header .travel-accomodation {
                    font-size: 0.85em;
                    margin: 0;
                }

                .travel-card-content {
                    display: none;
                }
                
                .travel-card-content.show {
                    display: block;
                }

                @media (min-width: 700px) {
                    .travel-card-header {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
                </style>
                <div class="travel-card">
                    <header class="travel-card-header">
                        <h1 class="travel-date"></h1>
                        <p class="travel-accomodation"></p>
                    </header>
                    <div class="travel-card-content">
                        <slot></slot>
                    </div>
                </div>
            `
            return template
        })()

        static observedAttributes = ['date', 'accomodation']

        connectedCallback() {
            const date = this.getAttribute('date') || '';
            const accomodation = this.getAttribute('accomodation') || '';

            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.appendChild(TravelCard._template.content.cloneNode(true))

            shadowRoot.querySelector('.travel-date').textContent = date
            shadowRoot.querySelector('.travel-accomodation').textContent = accomodation

            const header = shadowRoot.querySelector('.travel-card-header')
            if (header) {
                header.addEventListener('click', (e) => {
                    e.preventDefault()
                    shadowRoot.querySelector('.travel-card-content')?.classList.toggle('show')
                })
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue === newValue) return

            if (name === 'date') {
                const el = this.shadowRoot?.querySelector('.travel-date')
                if (el) el.textContent = newValue
            }
            if (name === 'accomodation') {
                const el = this.shadowRoot?.querySelector('.travel-accomodation')
                if (el) el.textContent = newValue
            }
        }
    }

    const elementTravelCardArticles = document.querySelectorAll('section.travel article')
    const elementTravelButtons = document.querySelectorAll('section.travel a.button')

    var showCard = (targetId) => {
        elementTravelCardArticles.forEach(article => {
            article.classList.add('display-none')
        })
        elementTravelCardArticles.forEach(article => {
            if (article.classList.contains(targetId)) {
                article.classList.remove('display-none')
            }
        })
    }

    customElements.define('travel-card', TravelCard)

    elementTravelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            const targetId = button.getAttribute('href')?.substring(1)
            showCard(targetId || 'central')
        })
    })

    showCard('central')
})()