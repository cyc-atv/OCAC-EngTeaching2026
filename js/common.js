function toChineseNum(number) {
    const map = {
        '1': '一', '2': '二', '3': '三', '4': '四', '5': '五',
        '6': '六', '7': '七', '8': '八', '9': '九'
    };

    // 使用 replace 搭配正規表達式 /[1-9]/g 進行全局替換
    return number.toString().replace(/[1-9]/g, s => map[s]);
}

function toOrdinal(n, ifHtml = false) {
    const num = parseInt(n);
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    // 邏輯：如果是 11-13 結尾用 th，否則取個位數對應的後綴
    if (ifHtml) {
        return num + '<sup>' + (s[(v - 20) % 10] || s[v] || s[0]) + '</sup>';
    } else {
        return num + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}

function toChineseDate(dateVal, returnWeekday = false) {
    // 1. 如果是 "none" 或空值，直接回傳原文字
    if (!dateVal || dateVal === "none") return dateVal;

    // 2. 嘗試將字串轉為 Date 物件
    const d = new Date(dateVal);

    // 3. 檢查轉換是否成功 (避免 Invalid Date)
    if (isNaN(d.getTime())) return dateVal;

    // 4. 使用 Intl.DateTimeFormat 輸出中文格式
    // options 可以設定要不要補零，例如 day: 'numeric' (不補零) 或 '2-digit' (補零)
    if (!returnWeekday) {
        return new Intl.DateTimeFormat('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(d).replace(/\//g, '月').replace(/(\d{2})$/, '$1日').replace('月', '年').replace('日', '日');
    } else {
        return new Intl.DateTimeFormat('zh-TW', {
            weekday: 'long'
        }).format(d)
    }
    
    // 或是更直覺的手動拼接：
    // return `${d.getFullYear()}年${(d.getMonth() + 1).toString().padStart(2, '0')}月${d.getDate().toString().padStart(2, '0')}日`;
}

function markdownToHTML(markdown, isLinkBlank = true) {
    const escapeHtml = (text) => {
        const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'}
        return text.replace(/[&<>"']/g, m => map[m])
    }

    const lines = markdown.split('\n')
    let result = []
    let inUL = false
    let inOL = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        
        // 檢查是否為無序列表
        if (/^[-*+]\s+/.test(line)) {
            const content = line.replace(/^[-*+]\s+/, '')
            if (!inUL) {
                result.push('<ul>')
                inUL = true
            }
            result.push('  <li>' + escapeHtml(content) + '</li>')
        } 
        // 檢查是否為有序列表
        else if (/^\d+\.\s+/.test(line)) {
            const content = line.replace(/^\d+\.\s+/, '')
            if (inUL) {
                result.push('</ul>')
                inUL = false
            }
            if (!inOL) {
                result.push('<ol>')
                inOL = true
            }
            result.push('  <li>' + escapeHtml(content) + '</li>')
        }
        // 普通文字
        else {
            if (inUL) {
                result.push('</ul>')
                inUL = false
            }
            if (inOL) {
                result.push('</ol>')
                inOL = false
            }
            if (line !== '') {
                result.push(line)
            }
        }
    }
    
    if (inUL) result.push('</ul>')
    if (inOL) result.push('</ol>')

    let html = result.join('<br>')

    // Headers
    html = html.replace(/^(#{1,6})\s*(.+)$/gm, (match, hashes, content) => {
        const level = hashes.length
        return `<h${level}>${escapeHtml(content).trim()}</h${level}>`
    })

    // Bold (必須在 Italic 之前處理)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    // Italic (使用更精確的正則，避免匹配到列表符號)
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2"${isLinkBlank ? ' target="_blank" rel="noopener noreferrer"' : ''}>$1</a>`)

    // Images
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')

    return html
}

(function() {
    class PageHeader extends HTMLElement {
        static get observedAttributes() {
            return ['title']
        }
        
        connectedCallback() {
            this._render()
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'title' && oldValue !== newValue) {
                this._render()
            }
        }

        _render() {
            const title = this.getAttribute('title') || ''
            this.innerHTML = `
                <style>
                    .page-header {
                        background-image: url('img/Header_Background.png');
                        background-size: cover;
                        background-position: center;
                        height: 8em;
                        display: flex;
                    }

                    .page-header .header-content {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                    }

                    .page-header .header-content h1 {
                        color: var(--primary-color);
                        font-size: 2.5em;
                        font-weight: bold;
                    }
                </style>
                <header class="page-header">
                    <div class="header-content">
                        <h1>${title}</h1>
                    </div>
                </header>
            `
        }
    }

    class SiteFooter extends HTMLElement {
        connectedCallback() {
            this._render()
        }

        _render() {
            this.innerHTML = `
                <style>

                    .footer {
                        background: var(--footer-background-color, #fff);
                        color: var(--footer-text-color, #000);
                    }

                    .footer .container{
                        display: flex;
                        flex-direction: column-reverse;
                        gap: 2em;
                        margin: 1em auto 0 auto;
                        padding-top: 1.5em;
                        padding-bottom: 1.5em;
                        max-width: 1200px;
                        width: 100%;
                    }

                    .footer .left {
                        padding: 0 0.5em;
                    }

                    .footer .right h1 {
                        margin: 0;
                        padding-bottom: 1em;
                        font-size: 1.5em;
                        text-align: center;
                    }

                    .footer .org-list {
                        display: flex;
                        flex-direction: column;
                        gap: 1em;
                    }

                    .footer .org-list .org-item a {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        gap: 1em;
                        color: var(--text-primary-color);
                        text-decoration: none;
                        padding: 0.5em;
                    }

                    .footer .org-list .org-item a::after {
                        content: '';
                        display: none;
                    }

                    .footer .org-list .org-item a:hover {
                        color: #fff;
                        background-color: var(--primary-color);
                        border-radius: 4px;
                    }

                    .footer .org-item-nameplate h2 {
                        font-size: 1.2em;
                        margin: 0;
                    }

                    .footer .org-item-nameplate p {
                        margin: 0;
                        font-size: 0.9em;
                        color: var(--text-secondary-color);
                    }

                    .footer .org-item a:hover .org-item-nameplate p {
                        color:#fff;
                    }

                    .footer .org-list .org-item img {
                        width: 48px;
                        height: auto;
                    }

                    @media (min-width: 700px) {
                        .footer .container {
                            flex-direction: row;
                        }
                        
                        .footer .container > * {
                            flex: 1;
                        }

                        .footer .left {
                            padding: 0;
                        }

                        .footer .org-list {
                            flex-direction: row;
                        }

                        .footer .org-list .org-item a {
                            flex-direction: column;
                            text-align: center;
                        }
                    }
                </style>
                <footer class="footer">
                    <div class="container">
                        <div class="left">
                            <p>承辦單位：嚕拉拉旅行社有限公司</p>
                            <p>聯絡地址：臺北市中山區民權東路二段69號</p>
                            <p><span>聯絡電話：</span><a href="tel:+886225965619">(02)2596-5619</a></p>
                            <p><span>E-Mail：</span><a href="mailto:090714@cyc.tw">090714@cyc.tw</a></p>
                            <p>服務時間 : 週一至週五 上午 9:00~下午 06:00</p>
                        </div>
                        <div class="right">
                            <h1>主辦單位</h1>
                            <div class="org-list">
                                <div class="org-item ocac">
                                    <a href="https://www.ocac.gov.tw/" target="_blank" rel="noopener noreferrer">
                                        <img src="img/organization/ocac-icon.png">
                                        <div class="org-item-nameplate">
                                            <h2>僑務委員會</h2>
                                            <p>Overseas Community Affairs Council, Republic of China (TAIWAN)</p>
                                        </div>
                                    </a>
                                </div>
                                <div class="org-item moe">
                                    <a href="https://www.moe.gov.tw/" target="_blank" rel="noopener noreferrer">
                                        <img src="img/organization/moe-icon.png">
                                        <div class="org-item-nameplate">
                                            <h2>教育部</h2>
                                            <p>Ministry of Education, Republic of China (TAIWAN)</p>
                                        </div>
                                    </a>
                                </div>
                                <div class="org-item hakka">
                                    <a href="https://www.hakka.gov.tw/" target="_blank" rel="noopener noreferrer">
                                        <img src="img/organization/hakka-icon.png">
                                        <div class="org-item-nameplate">
                                            <h2>客家委員會</h2>
                                            <p>Hakka Affairs Council, Republic of China (TAIWAN)</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            `
        }
    }

    customElements.define("page-header", PageHeader)
    customElements.define("site-footer", SiteFooter)
})()