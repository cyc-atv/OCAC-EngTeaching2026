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