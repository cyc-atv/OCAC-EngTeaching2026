(function() {
    class NewsItem extends HTMLElement {
        connectedCallback() {
            this._isShowDetail = false
            this._render()

            this.addEventListener('click', (e) => {
                if (e.target.closest('.news-header')) {
                    this._onSelect()
                }
            })
        }

        _render() {
            const date = this.getAttribute('data-date')
            const title = this.getAttribute('data-title')
            const description = this.getAttribute('data-description')

            this.innerHTML = `
                <style>
                .news-item {
                    display: block;
                    border: 1px solid var(--primary-color);
                    border-radius: 4px;
                }

                .news-item-container {
                    display: flex;
                    flex-direction: column;
                }

                .news-item-container .news-header {
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    padding: 0.5em 1em;
                    transition: all 0.3s;
                }

                .news-item-container .news-header:hover {
                    color: #fff;
                    background-color: var(--secondary-color);
                }

                .news-item-container .news-title {
                    font-size: 1.15em;
                }

                .news-item-container .news-detail {
                    padding: 1em 2em;
                    background-color: var(--secondary-color);
                    color: #fff;
                }
                </style>
                <div class="news-item-container">
                    <div class="news-header">
                        <h1 class="news-title">${title}</h1>
                        <p class="news-date">${date}</p>
                    </div>
                    <div class="news-detail ${this._isShowDetail ? '' : 'display-none'} markdown-content">
                        ${markdownToHTML(description)}
                    </div>
                </div>
            `
        }

        _onSelect() {
            this._isShowDetail = !this._isShowDetail
            this.querySelector('.news-detail').classList.toggle('display-none');
        }
    }
    customElements.define('news-item', NewsItem)

    const elementNewsList = document.querySelector('.news .news-list')
    
    fetch('./js/data.json', { cache: "no-cache" }).then(response => response.json())
    .then(data => {
        if (data.news.length == 0) return

        elementNewsList.innerHTML = ''
        data.news.forEach(item => {
            var elementNewsItem = new NewsItem()
            elementNewsItem.classList.add('news-item')
            elementNewsItem.setAttribute('data-id', item.id)
            elementNewsItem.setAttribute('data-date', item.date)
            elementNewsItem.setAttribute('data-title', item.title)
            elementNewsItem.setAttribute('data-description', item.description)

            elementNewsList.appendChild(elementNewsItem)
        })
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("module-ready", { detail: {module: "news"}}));
    })

})()